import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing with a large limit for base64 PDFs
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const apiKey = process.env.ANTHROPIC_API_KEY || '';
let anthropic = null;
if (apiKey && !apiKey.includes('your_actual')) {
  try {
    anthropic = new Anthropic({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize Anthropic client:', err.message);
  }
} else {
  console.warn('WARNING: ANTHROPIC_API_KEY is not defined in the environment. Falling back to offline Demo Mode.');
}

// ==========================================
// HIGH-FIDELITY MOCK DATABASE FOR QUICK-STARTS
// ==========================================

const MOCK_GI = {
  "goal": "Second Income",
  "product_name": "Tata AIA Life Fortune Guarantee Plus",
  "insurer": "Tata AIA Life",
  "policy_type": "Non-Par Guaranteed Income Plan",
  "headline": "Guaranteed Second Income for 12 Years",
  "tagline": "A secure way to create an additional income stream for your family's future needs.",
  "details": [
    { "icon": "👤", "label": "Age", "value": "35 Years" },
    { "icon": "💸", "label": "Premium", "value": "Rs. 1,00,000" },
    { "icon": "🗓️", "label": "Premium Paying Term", "value": "10 Years" },
    { "icon": "📋", "label": "Policy Term", "value": "24 Years" },
    { "icon": "🏦", "label": "Cover", "value": "Rs. 11,00,000" },
    { "icon": "📊", "label": "IRR/Yield", "value": "6.12%" }
  ],
  "milestones": [
    { "year": "Years 1 - 10", "event": "Premium Paying Period", "detail": "Pay Rs. 1,00,000 annually for 10 years (Total Rs. 10,00,000 paid).", "type": "pay" },
    { "year": "Year 11", "event": "Deferment Period", "detail": "Waiting period. No premiums paid, life cover continues.", "type": "wait" },
    { "year": "Years 12 - 23", "event": "Guaranteed Income Payout", "detail": "Receive guaranteed Rs. 92,500 annually (Total Rs. 11,10,000 received).", "type": "receive" },
    { "year": "Year 24", "event": "Maturity", "detail": "Receive Rs. 10,00,000 return of all paid premiums. Policy ends.", "type": "end" }
  ],
  "how_it_works": [
    { "icon": "💰", "title": "Guaranteed Income", "point": "Receive Rs. 92,500 tax-free income annually for 12 years." },
    { "icon": "🛡️", "title": "Life Coverage", "point": "Rs. 11,00,000 active life cover keeps your family protected." },
    { "icon": "💵", "title": "Premium Return", "point": "Get back 100% of your premiums (Rs. 10,00,000) at maturity." }
  ],
  "disclaimer": "Figures are illustrative as per BI. Demo Fallback active. Subject to policy terms."
};

const MOCK_TERM = {
  "goal": "Family Protection",
  "product_name": "HDFC Life Click 2 Protect Super",
  "insurer": "HDFC Life",
  "policy_type": "Non-Linked Non-Par Term Plan",
  "headline": "Rs. 1.5 Crore Protection Till Age 72",
  "tagline": "Protect your family's future with a massive cover and return of premium on survival.",
  "details": [
    { "icon": "👤", "label": "Age", "value": "32 Years" },
    { "icon": "💸", "label": "Premium", "value": "Rs. 24,500" },
    { "icon": "🗓️", "label": "Premium Paying Term", "value": "10 Years" },
    { "icon": "📋", "label": "Policy Term", "value": "40 Years" },
    { "icon": "🏦", "label": "Cover", "value": "Rs. 1,50,00,000" },
    { "icon": "🔃", "label": "ROP", "value": "Yes" }
  ],
  "milestones": [
    { "year": "Years 1 - 10", "event": "Premium Paying Period", "detail": "Pay Rs. 24,500 annually for 10 years (Total Rs. 2,45,000 paid).", "type": "pay" },
    { "year": "Years 11 - 39", "event": "Active Cover Period", "detail": "No premiums to pay. Active life cover of Rs. 1.5 Crores continues.", "type": "wait" },
    { "year": "Year 40", "event": "Maturity (ROP)", "detail": "Receive Rs. 2,45,000 (100% Return of Premium). Life cover ends.", "type": "end" }
  ],
  "how_it_works": [
    { "icon": "🛡️", "title": "High Life Cover", "point": "Rs. 1.5 Crores death benefit paid immediately to your nominee." },
    { "icon": "💸", "title": "Limited Premium Pay", "point": "Pay premiums for only 10 years but stay covered for 40 years." },
    { "icon": "🔄", "title": "Return of Premium", "point": "Survival to maturity refunds 100% of your paid premiums." }
  ],
  "disclaimer": "Figures are illustrative as per BI. Demo Fallback active. Subject to policy terms."
};

const MOCK_WEALTH = {
  "goal": "Wealth Creation through Single Premium",
  "product_name": "ICICI Pru Gift Pro Single Pay",
  "insurer": "ICICI Prudential Life",
  "policy_type": "Non-Par Single Pay Wealth Plan",
  "headline": "Single Premium Wealth Plan with 7.25% Yield",
  "tagline": "Invest once and reap yearly guaranteed payouts with single premium peace of mind.",
  "details": [
    { "icon": "👤", "label": "Age", "value": "30 Years" },
    { "icon": "💸", "label": "Premium", "value": "Rs. 5,00,000" },
    { "icon": "🗓️", "label": "Premium Paying Term", "value": "Single Pay" },
    { "icon": "📋", "label": "Policy Term", "value": "15 Years" },
    { "icon": "🏦", "label": "Cover", "value": "Rs. 6,25,000" },
    { "icon": "📊", "label": "IRR/Yield", "value": "7.25%" }
  ],
  "milestones": [
    { "year": "Year 1", "event": "Single Premium Pay", "detail": "Pay Rs. 5,00,000 once. Life cover of Rs. 6,25,000 starts.", "type": "pay" },
    { "year": "Years 2 - 5", "event": "Deferment Period", "detail": "No premiums to pay, wealth accumulates with active cover.", "type": "wait" },
    { "year": "Years 6 - 14", "event": "Guaranteed Income", "detail": "Receive annual guaranteed payouts of Rs. 52,000 (Total Rs. 4,68,000).", "type": "receive" },
    { "year": "Year 15", "event": "Policy Maturity", "detail": "Receive Rs. 6,50,000 (Premium Return + Loyalty Additions). Policy ends.", "type": "end" }
  ],
  "how_it_works": [
    { "icon": "💰", "title": "Guaranteed Returns", "point": "Receive Rs. 52,000 annual payouts for 9 years plus maturity lump sum." },
    { "icon": "📈", "title": "Loyalty Additions", "point": "Maturity payout of Rs. 6,50,000 includes loyalty returns." },
    { "icon": "🛡️", "title": "One-Time Pay Protection", "point": "Rs. 6,25,000 life cover runs for 15 years with just one payment." }
  ],
  "disclaimer": "Figures are illustrative as per BI. Demo Fallback active. Subject to policy terms."
};

// ==========================================
// DYNAMIC REGEX DATA EXTRACTION FALLBACK
// ==========================================

function generateDynamicMock(text) {
  const cleanText = text.replace(/\s+/g, ' ');
  
  // 1. Detect Goal
  let goal = "Wealth Creation";
  if (/term|protect|cover|death benefit|family/i.test(cleanText)) {
    goal = "Family Protection";
  } else if (/income|payout|survival|annuity|regular/i.test(cleanText)) {
    goal = "Second Income";
  } else if (/single|one[ \-]time/i.test(cleanText)) {
    goal = "Wealth Creation through Single Premium";
  } else if (/child|education|marriage/i.test(cleanText)) {
    goal = "Child Education / Marriage";
  } else if (/retirement|pension/i.test(cleanText)) {
    goal = "Retirement";
  }

  // 2. Detect Insurer
  let insurer = "Bajaj Allianz Life";
  const insurerMatches = cleanText.match(/(tata aia|hdfc life|icici pru|sbi life|max life|lic|bajaj allianz)/i);
  if (insurerMatches) {
    insurer = insurerMatches[1].toUpperCase().includes("TATA") ? "Tata AIA Life" : 
              insurerMatches[1].toUpperCase().includes("HDFC") ? "HDFC Life" :
              insurerMatches[1].toUpperCase().includes("ICICI") ? "ICICI Prudential Life" : 
              insurerMatches[1].toUpperCase().includes("SBI") ? "SBI Life" : "Bajaj Allianz Life";
  }

  // 3. Detect Product Name
  let product_name = "Guaranteed Income Goal";
  const prodMatches = cleanText.match(/(?:product|plan|name)\s*[:\-]*\s*([a-zA-Z\d\s]{5,40})/i);
  if (prodMatches && prodMatches[1]) {
    product_name = prodMatches[1].trim();
  }

  // 4. Extract Age
  let age = "35 Years";
  const ageMatches = cleanText.match(/(?:age|life assured age|entry age)\s*[:\-\s]*\s*(\d{1,2})/i);
  if (ageMatches && ageMatches[1]) {
    age = ageMatches[1].trim() + " Years";
  }

  // 5. Extract Premium
  let premium = "Rs. 1,00,000";
  const premMatches = cleanText.match(/(?:annualised premium|premium amount|annual premium|premium|modal premium)\s*[:\-\s]*(?:Rs\.?|INR|Rs)?\s*([\d,]{4,10})/i);
  if (premMatches && premMatches[1]) {
    premium = "Rs. " + premMatches[1].trim();
  }

  // 6. Extract Cover / Sum Assured
  let cover = "Rs. 10,00,000";
  const coverMatches = cleanText.match(/(?:sum assured|life cover|death benefit|cover|coverage)\s*[:\-\s]*(?:Rs\.?|INR|Rs)?\s*([\d,]{5,12})/i);
  if (coverMatches && coverMatches[1]) {
    cover = "Rs. " + coverMatches[1].trim();
  }

  // 7. Extract Policy Term (PT)
  let pt = "20 Years";
  const ptMatches = cleanText.match(/(?:policy term|pt|term)\s*[:\-\s]*\s*(\d{1,2})\b/i);
  if (ptMatches && ptMatches[1]) {
    pt = ptMatches[1].trim() + " Years";
  }

  // 8. Extract Premium Paying Term (PPT)
  let ppt = "10 Years";
  const pptMatches = cleanText.match(/(?:premium paying term|ppt|pay term|paying term)\s*[:\-\s]*\s*(\d{1,2})\b/i);
  if (pptMatches && pptMatches[1]) {
    ppt = pptMatches[1].trim() + " Years";
  }

  // 9. Extract IRR
  let irr = "6.25%";
  const irrMatches = cleanText.match(/(?:irr|yield|internal rate of return)\s*[:\-\s]*\s*([\d\.]+%?)/i);
  if (irrMatches && irrMatches[1]) {
    irr = irrMatches[1].trim();
    if (!irr.includes('%')) irr += '%';
  }

  const pptVal = parseInt(ppt) || 10;
  const ptVal = parseInt(pt) || 20;
  const premVal = parseInt(premium.replace(/[^\d]/g, '')) || 100000;

  // Build Details Ribbon
  const details = [
    { "icon": "👤", "label": "Age", "value": age },
    { "icon": "💸", "label": "Premium", "value": premium },
    { "icon": "🗓️", "label": "Premium Paying Term", "value": ppt },
    { "icon": "📋", "label": "Policy Term", "value": pt },
    { "icon": "🏦", "label": "Cover", "value": cover },
    { "icon": "📊", "label": "IRR/Yield", "value": irr }
  ];

  // Build Timeline Milestones
  const milestones = [
    { "year": `Years 1 - ${pptVal}`, "event": "Premium Payment Period", "detail": `Pay ${premium} annually for ${pptVal} years.`, "type": "pay" }
  ];
  if (ptVal > pptVal) {
    milestones.push({ "year": `Years ${pptVal + 1} - ${ptVal - 1}`, "event": "Policy Accumulation", "detail": `Enjoy active life cover of ${cover} with zero further premiums.`, "type": "wait" });
  }
  if (goal === "Second Income" || goal === "Retirement") {
    milestones.push({ "year": `Years ${pptVal + 2} - ${ptVal - 1}`, "event": "Guaranteed Payouts", "detail": `Receive annual payouts of Rs. ${Math.round(premVal * 0.9).toLocaleString('en-IN')} tax-free.`, "type": "receive" });
  }
  milestones.push({ "year": `Year ${ptVal}`, "event": "Policy Maturity", "detail": `Receive maturity payout of Rs. ${Math.round(premVal * pptVal * 1.15).toLocaleString('en-IN')} (including ROP).`, "type": "end" });

  // Build How It Works Cards
  const how_it_works = [
    { "icon": "🛡️", "title": "Life Protection", "point": `Stay protected with an active life cover of ${cover} throughout the policy term.` },
    { "icon": "💰", "title": "Guaranteed Returns", "point": `Your savings grow steadily with tax-free payouts and maturity loyalty additions.` },
    { "icon": "🔄", "title": "Return of Premium", "point": `Refund of all premiums paid plus bonuses at maturity.` }
  ];

  return {
    "goal": goal,
    "product_name": product_name || "Guaranteed Wealth Goal",
    "insurer": insurer,
    "policy_type": goal === "Family Protection" ? "Non-Par Term Plan" : "Non-Par Guaranteed Income Plan",
    "headline": `Guaranteed ${goal} Plan for your future`,
    "tagline": `A custom financial plan built for your specific life milestones.`,
    "details": details,
    "milestones": milestones,
    "how_it_works": how_it_works,
    "disclaimer": "Figures are illustrative. Demo Fallback active (No API Key configured or Invalid Key). Subject to policy terms."
  };
}

function getFallbackResponse(text) {
  if (!text) {
    return MOCK_GI;
  }
  
  if (/Fortune Guarantee Plus|tata aia/i.test(text)) {
    return MOCK_GI;
  }
  if (/Click 2 Protect Super|hdfc life/i.test(text)) {
    return MOCK_TERM;
  }
  if (/Gift Pro Single Pay|icici prudential/i.test(text)) {
    return MOCK_WEALTH;
  }
  
  // Custom BI uploads fall back to the dynamic regex extractor!
  return generateDynamicMock(text);
}

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

  // Fallback immediately if client or key is not set
  if (!anthropic || !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('your_actual')) {
    console.log('No active API Key. Serving fallback response...');
    return res.json(getFallbackResponse(text));
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
    console.warn('Claude API request failed. Falling back to Demo Mode...', error.message);
    // Graceful fallback for invalid/revoked keys or network errors
    return res.json(getFallbackResponse(text));
  }
});

// REST route for PDF explanation
app.post('/api/explain-pdf', async (req, res) => {
  const { base64, extractedText } = req.body;

  if (!base64 || base64.trim() === '') {
    return res.status(400).json({ error: 'Base64 PDF content is required' });
  }

  const textToAnalyze = extractedText || '';

  // Fallback immediately if client or key is not set
  if (!anthropic || !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('your_actual')) {
    console.log('No active API Key. Serving fallback response for PDF...');
    return res.json(getFallbackResponse(textToAnalyze));
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
    console.warn('Claude API request failed for PDF. Falling back to Demo Mode...', error.message);
    // Graceful fallback using the browser's extracted text stream
    return res.json(getFallbackResponse(textToAnalyze));
  }
});

// Serve static files from the React frontend build folder
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback all SPA web page requests to React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Start backend
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
