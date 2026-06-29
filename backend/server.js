import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing with a large limit for base64 PDFs
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const apiKey = process.env.ANTHROPIC_API_KEY || '';
if (!apiKey) {
  console.warn('WARNING: ANTHROPIC_API_KEY is not defined in the environment. All API calls will fail until configured.');
}

const anthropic = new Anthropic({ apiKey });

// System Prompt for Claude
const SYSTEM_PROMPT = `You are a Senior Relationship Manager at Bajaj Capital Insurance Broking. Analyse the Benefit Illustration and return ONLY a valid JSON object — no markdown, no text outside JSON. Keep ALL strings under 90 chars.

"goal" must be exactly one of: Family Protection, Second Income, Wealth Creation through Single Premium, Wealth Creation, Child Education / Marriage, Retirement

Return this exact JSON structure:
{
  "goal": "",
  "product_name": "",
  "insurer": "",
  "policy_type": "e.g. Non-Par Guaranteed Income / ULIP / Term Plan",
  "headline": "max 9 words punchy benefit promise",
  "tagline": "one sentence what financial need this solves",
  "details": [{ "icon": "emoji", "label": "field name", "value": "value" }],
  "milestones": [{ "year": "Year X", "event": "short name", "detail": "numbers + what happens", "type": "pay|wait|receive|end" }],
  "how_it_works": [{ "icon": "emoji", "title": "short title", "point": "benefit with number" }],
  "disclaimer": "Figures are illustrative as per BI. Subject to policy terms."
}

Rules:
1. details: 4-6 items using emoji, label, value. Labels should be selected from:
   - 👤Age
   - 💸Premium
   - 🗓️Premium Paying Term
   - 📋Policy Term
   - 🏦Cover
   - 📊IRR/Yield
   - 💵Maturity
   - 🔄Income
   - 🔃ROP
   For the emoji field in details array, use the emoji character itself (e.g. "👤").
2. milestones: 3-6 items. The "type" MUST be exactly one of "pay" (for premium paying years), "wait" (for deferment years), "receive" (for income/benefit start), "end" (for maturity/policy end).
3. how_it_works: 3-4 items. Summarize the major selling points/benefits with numbers.
4. All rupee amounts must use the "Rs." prefix.
5. All text strings in the JSON must be concise and under 90 characters.
6. Return ONLY raw JSON starting with { and ending with }. Do not wrap in markdown blocks like \`\`\`json.

CRITICAL DATA EXTRACTION DIRECTIONS FOR COMPLEX TABLES:
- Premium Paying Term (Premium Paying Term): Count the exact number of years in the table where a non-zero Premium is paid. Do not guess.
- Policy Term (Policy Term): Identify the total duration of the policy (the last year shown in the illustration table or policy schedule).
- Age: Look for "Age", "Entry Age", "Age of Life Assured".
- Premium: Look for "Annualised Premium", "Modal Premium", "Premium amount". Exclude taxes/GST if clean figures are available.
- Cover (Sum Assured): Look for "Sum Assured", "Life Cover", "Sum Assured on Death", or "Basic Sum Assured".
- IRR/Yield: Look for "IRR", "Net Yield", or "Internal Rate of Return". If not explicitly printed, search the text for a percentage followed by "IRR" or "yield".
- Maturity: Payout at the end of the Policy Term. Search for "Maturity Benefit", "Maturity Sum Assured", "Maturity Payout", or the last row's survival/surrender benefit.
- Income: Search for "Survival Benefit", "Guaranteed Payout", "Annual Income", "Annuity".
- Milestone Events: Verify that Year 1 corresponds to "pay" premium years, wait years correspond to "wait" deferment years, receive years correspond to payouts, and the final year corresponds to "end" (Maturity).
- Guaranteed vs Illustrative: Prioritize Guaranteed cash flows. If extracting non-guaranteed benefits (like ULIPs), label them clearly as 'Illustrative (8%)' or 'Estimated'.`;

/**
 * Robust JSON extraction and repair function
 */
function parseTruncatedJson(str) {
  if (!str) {
    throw new Error('Received empty response from AI.');
  }

  let cleaned = str.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  const firstBrace = cleaned.indexOf('{');
  if (firstBrace === -1) {
    throw new Error('No JSON object found in response.');
  }
  cleaned = cleaned.substring(firstBrace);

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn('Initial JSON parse failed. Attempting back-tracking repair...', e.message);
  }

  let attempt = cleaned;
  while (attempt.length > 0) {
    const stack = [];
    let inString = false;
    let escape = false;

    for (let i = 0; i < attempt.length; i++) {
      const c = attempt[i];
      if (inString) {
        if (escape) {
          escape = false;
        } else if (c === '\\') {
          escape = true;
        } else if (c === '"') {
          inString = false;
        }
      } else {
        if (c === '"') {
          inString = true;
        } else if (c === '{' || c === '[') {
          stack.push(c);
        } else if (c === '}') {
          if (stack[stack.length - 1] === '{') stack.pop();
        } else if (c === ']') {
          if (stack[stack.length - 1] === '[') stack.pop();
        }
      }
    }

    let closedAttempt = attempt;
    if (inString) {
      closedAttempt += '"';
    }
    
    closedAttempt = closedAttempt.replace(/[:,\s]+$/, '');

    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i] === '{') closedAttempt += '}';
      else if (stack[i] === '[') closedAttempt += ']';
    }

    closedAttempt = closedAttempt.replace(/,\s*([}\]])/g, '$1');

    try {
      return JSON.parse(closedAttempt);
    } catch (err) {
      attempt = attempt.substring(0, attempt.length - 1);
    }
  }

  throw new Error('Failed to parse and repair truncated JSON response.');
}

// REST route for text explanation
app.post('/api/explain-text', async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text input is required' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Anthropic API Key is not configured on the server. Please add your ANTHROPIC_API_KEY in the backend .env file.' });
  }

  try {
    console.log('Sending text explanation request to Claude...');
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Here is the Benefit Illustration (BI) text:\n\n${text}`
            }
          ]
        }
      ]
    });

    const replyText = response.content[0].text;
    console.log('Received response from Claude. Parsing JSON...');
    const resultJson = parseTruncatedJson(replyText);
    res.json(resultJson);

  } catch (error) {
    console.error('Error explaining text:', error);
    res.status(500).json({ error: error.message || 'An error occurred while communicating with the AI.' });
  }
});

// REST route for PDF explanation
app.post('/api/explain-pdf', async (req, res) => {
  const { base64 } = req.body;

  if (!base64 || base64.trim() === '') {
    return res.status(400).json({ error: 'Base64 PDF content is required' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Anthropic API Key is not configured on the server. Please add your ANTHROPIC_API_KEY in the backend .env file.' });
  }

  try {
    console.log('Sending PDF explanation request to Claude...');
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      betas: ['pdfs-2024-09-25'],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64
              }
            },
            {
              type: 'text',
              text: 'Please analyze this Benefit Illustration (BI) PDF document.'
            }
          ]
        }
      ]
    });

    const replyText = response.content[0].text;
    console.log('Received response from Claude for PDF. Parsing JSON...');
    const resultJson = parseTruncatedJson(replyText);
    res.json(resultJson);

  } catch (error) {
    console.error('Error explaining PDF:', error);
    res.status(500).json({ error: error.message || 'An error occurred while communicating with the AI.' });
  }
});

// Start backend
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
