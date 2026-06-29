# Bajaj Capital BI Explainer Tool

[![Deploy to Render](https://render.com/images/deploy-to-render.svg)](https://render.com/deploy?repo=https://github.com/AgenticVI/bajaj-bi-explainer)

This web application helps Relationship Managers (RMs) at **Bajaj Capital Insurance Broking** instantly convert complex Benefit Illustration (BI) documents (pasted text or uploaded PDFs) into simple, clean, client-facing visual cards. 

The styling is inspired by the **Headspace** design language, using a warm, friendly, clean look (strictly no greys) with strong card shadows and customized colors mapping directly to 6 distinct financial goal categories.

---

## Technical Stack
- **Frontend**: React + Vite (Vanilla CSS)
- **Backend**: Node.js + Express
- **AI Core**: Anthropic Claude API (`claude-3-5-sonnet-20241022`) via native PDF base64 document blocks.

---

## Setup Instructions

### 1. Configure the API Key
Create or open the `.env` file inside the `backend` folder:
`C:\Users\vishal.p_bajajcapita\.gemini\antigravity\scratch\bajaj-bi-explainer\backend\.env`

Set your Anthropic Claude API Key:
```env
PORT=5000
ANTHROPIC_API_KEY=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
```

### 2. Install Dependencies
From the root project directory (`C:\Users\vishal.p_bajajcapita\.gemini\antigravity\scratch\bajaj-bi-explainer`), run:
```bash
npm run install-all
```
*This installs root dependencies (`concurrently`), backend packages (`express`, `@anthropic-ai/sdk`, `dotenv`, `cors`), and frontend packages (`react`, `vite`, `lucide-react`).*

### 3. Run the Application
Start both the Express backend and the Vite dev server concurrently by running:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and navigate to the local frontend server:
👉 **[http://localhost:5173](http://localhost:5173)**

*All API calls to `/api/...` are automatically proxied to the backend running at `http://localhost:5000` via Vite's proxy configuration.*

---

## Key Features & Design Details
- **Warm Theme**: Strictly zero greys. Base canvas is `#F5F3EF`, body text is warm charcoal `#2D2522`, and details are styled in soft warm browns.
- **6 Goal Colors**: Visual headers, cards, timeline milestones, and accent bars dynamically adapt to the detected goal color family (e.g. Family Protection = Red-Orange, Second Income = Amber, Retirement = Green).
- **Interactive Input**: paste full BI text reports or upload/drag-and-drop a PDF. Drag-and-drop includes custom border animations and upload confirmations.
- **Quick-Start Cards**: 3 pre-loaded real-world illustrations let you test the app instantly with a single click.
- **Robust JSON Repair**: The Express backend parses and repairs truncated Claude responses character-by-character to guarantee the client never experiences raw JSON crashes.
- **Print Layout**: The layout is print-optimized (`@media print`). Hitting **Save / Print** (or Ctrl+P) hides the browser UI, sidebar, and buttons, generating a clean client PDF or physical handout retaining all beautiful goal gradients and cards.
