export const MOCK_GI = {
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

export const MOCK_TERM = {
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

export const MOCK_WEALTH = {
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

export function generateDynamicMock(text) {
  const cleanText = (text || '').replace(/\s+/g, ' ');
  
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
    const matched = insurerMatches[1].toLowerCase();
    insurer = matched.includes("tata") ? "Tata AIA Life" : 
              matched.includes("hdfc") ? "HDFC Life" :
              matched.includes("icici") ? "ICICI Prudential Life" : 
              matched.includes("sbi") ? "SBI Life" : "Bajaj Allianz Life";
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

  // Build Details
  const details = [
    { "icon": "👤", "label": "Age", "value": age },
    { "icon": "💸", "label": "Premium", "value": premium },
    { "icon": "🗓️", "label": "Premium Paying Term", "value": ppt },
    { "icon": "📋", "label": "Policy Term", "value": pt },
    { "icon": "🏦", "label": "Cover", "value": cover },
    { "icon": "📊", "label": "IRR/Yield", "value": irr }
  ];

  // Build Milestones
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

  // Build How It Works
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
    "disclaimer": "Figures are illustrative. Demo Fallback active. Subject to policy terms."
  };
}

export function getFallbackResponse(text) {
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
  
  return generateDynamicMock(text);
}
