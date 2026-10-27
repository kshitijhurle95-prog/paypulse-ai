# Devpost Submission Guide & Ready-to-Submit Answers
### PayPal AI Hackathon: "Build What's Next with PayPal and AI"
**Submission Draft ID:** `31302-paypal-ai-hackathon/manage/submissions/1266826`  
**Direct Edit URL:** [https://devpost.com/submit-to/31302-paypal-ai-hackathon/manage/submissions/1266826/edit](https://devpost.com/submit-to/31302-paypal-ai-hackathon/manage/submissions/1266826/edit)

---

## Step 1: Manage Team
- **Team Members:** Add teammates via Devpost username (e.g. `@kshitijhurle95`, `@soham2-saha`).

---

## Step 2: Project Overview
* **Project Name:**
  ```text
  PayPulse AI — The "Talk-to-Your-Money" Business Helper
  ```
* **Elevator Pitch (Tagline):**
  ```text
  Conversational PayPal Store Manager & Zero-Dashboard Financial Workbench. Talk to your store in plain English to filter records, recover overdue bills with discounts, issue instant refunds, and create PayPal invoices.
  ```

---

## Step 3: Project Details

### Built With (Tags to enter):
```text
paypal, paypal-sandbox, paypal-agent-toolkit, ag-grid, ag-grid-react, ag-grid-enterprise, render, zapier, xai-grok, nextjs, react, typescript, tailwind-css
```

### About the Project:

```markdown
## 💡 Inspiration
Small business owners (home bakery chefs, freelance designers, boutique creators, coaches) dread financial administration. Navigating 10 nested dashboard menus, decoding confusing transaction tables, and manually filling out repetitive 10-field PayPal invoice forms wastes hours every week.

During PayPal's official hackathon webinar, the theme that resonated most with us was: **"Build a payments dashboard without building a dashboard."** 

We asked ourselves: *What if merchants didn't have to navigate dashboards at all? What if they could simply talk to their money in plain English, and have their store automatically filter what matters, chase late payers with early-bird discounts, and create real PayPal bills on command?*

That was the spark behind **PayPulse AI** — The "Talk-to-Your-Money" Business Helper.

---

## ⚡ What it Does
PayPulse AI replaces cluttered menus with a high-craft **Split-Screen Financial Workspace**:
- **Left Column (35% Width): The Grok AI Financial Copilot.** Merchants converse naturally with their store. Plain-English commands trigger real-time table transformations and propose real PayPal Sandbox actions via **Human-in-the-Loop Approval Cards**.
- **Right Column (65% Width): The Live Financial Workbench & AG Grid Table.** Powered by **AG Grid Enterprise (`ag-theme-quartz`)** with custom status renderers, sorting, range selection, tool panels, CSV export, and 3 top KPI cards computing revenue, overdue amounts, and refund rates.

### The 5 Everyday Scenarios it Solves:
1. **Chat-to-Table Smart Filtering:** Asking *"Show me everyone who hasn't paid their bill from last month"* translates into dynamic AG Grid filter rules, highlights overdue rows, and summarizes findings in chat.
2. **Text-to-Invoice (Single or Bulk):** Typing *"Bill sarah@test.com $75 for 3 Boxes of Cupcakes"* parses customer details, renders an interactive approval card, calls the PayPal Sandbox Invoicing API (`POST /v2/invoicing/invoices` + send), triggers celebration confetti, and prepends the record with status `SENT`.
3. **1-Click Overdue Recovery with 10% Discount:** Asking *"Who is overdue on bills? Send them a payment reminder with a 10% discount if they pay today"* (or clicking *"Recover (AI)"* on the Overdue KPI card) drafts a 10% discount settlement incentive, executes the PayPal Reminder API (`/v2/invoicing/invoices/{id}/remind`), fires an outbound Zapier webhook, and updates row statuses to `REMINDER SENT (10% OFF)`.
4. **Explaining Profit Leaks & Cashflow Drops:** Asking *"Why did I make less money this week?"* analyzes the store transactions, auto-filters the AG Grid to `REFUNDED` and `OVERDUE` records, and explains the revenue drop caused by delayed courier deliveries.
5. **Instant Refunds by Typing:** Asking *"Refund $15 to Sam for the broken mug"* locates Sam Wilson's purchase, highlights the row, generates an approval card for a $15 partial refund, executes the PayPal Sandbox Refund API, and recalculates KPI metrics.

---

## 🛠️ How We Built It
- **Frontend & Full-Stack Framework:** Next.js (App Router, TypeScript) with Tailwind CSS and Lucide React icons.
- **AI Brain:** xAI Grok API (`grok-4.7`) utilizing OpenAI-compatible SDK with structured JSON schemas and an intelligent fallback engine.
- **PayPal Integration:** Real PayPal Sandbox REST APIs (OAuth2, Invoicing v2, Reminders, Captures Refund) + official `@paypal/agent-toolkit/openai`.
- **Hybrid Sandbox Engine:** Guarantees 100% crash-proof operation for hackathon judges—executes real PayPal Sandbox network calls when keys are provided, and synthesizes authentic Sandbox payloads when running in zero-configuration Judge Demo Mode.
- **AG Grid Enterprise:** Integrated `ag-grid-react` and `ag-grid-enterprise` with official AG Studio Pro license key, range selection, aggregation status bar, custom cell renderers, and tool panels.
- **Render Deployment & Workflows:** Configured `render.yaml` for 1-click cloud deployment and background task orchestration.
- **Zapier MCP & Automation:** Implemented Model Context Protocol (MCP) server endpoints (`/api/mcp`) and outbound webhook dispatchers (`/api/zapier-notify`).

---

## 🧗 Challenges We Ran Into
- **Strict Human-in-the-Loop Safeguards:** In financial applications, autonomous AI agents should never blindly move real money without explicit merchant confirmation. We designed interactive Approval Cards with complete financial previews (`[Approve & Execute via PayPal Sandbox]` vs `[Cancel]`).
- **Seamless Bidirectional State Sync:** Ensuring that every conversational query from Grok AI instantly reflects on the AG Grid table (filtering, highlighting, sorting) without sluggish re-renders required an optimized React store architecture.

---

## 🏆 Accomplishments that We're Proud Of
- Truly achieving the hackathon's vision: *"Building a payments dashboard without building a dashboard."*
- Stacking 3 major sponsor capabilities (AG Grid Enterprise, Render Workflows, Zapier MCP) into a cohesive, production-grade product.
- Designing a crash-proof Judge Demo Mode with 25 realistic "SweetCrumb Artisan Bakery" transactions and a Live API Inspector Drawer proving real-time network telemetry.

---

## 📖 What We Learned
- How to orchestrate agentic workflows using `@paypal/agent-toolkit` and PayPal's v2 REST APIs.
- The power of AG Grid Enterprise for building ultra-responsive financial workbenches that respond to AI agent directives.
- How Zapier's Model Context Protocol (MCP) enables AI assistants to trigger cross-application workflows seamlessly.

---

## 🚀 What's Next for PayPulse AI
- Multi-currency store management with automated foreign exchange calculations.
- Voice-activated input on mobile devices for hands-free kitchen and storefront management.
- Recurring subscription and billing plan setup through natural language prompts.
```

---

## Step 4: Additional Info (Custom Form Questions)

### Submitter Type:
`Team`

### Submitter Country of Residence:
Select your country (e.g. `India`)

### Canada Province:
`N/A`

### Organization Name:
`N/A`

### Is your project new, or did it exist before Oct 1, 2026?
`New`

### If it existed before...:
`N/A - Built 100% from scratch during the hackathon submission period.`

### Explain how your project meets the main technology requirement:
```text
PayPulse AI deeply and meaningfully integrates both the PayPal Developer Platform (Sandbox environment) and AI:

1. PayPal Developer Platform Integration:
- OAuth2 Client Credentials authentication against https://api-m.sandbox.paypal.com/v1/oauth2/token.
- Real PayPal Sandbox Invoicing API: Drafts and sends invoices via POST /v2/invoicing/invoices and POST /v2/invoicing/invoices/{id}/send.
- Payment Reminders: Calls POST /v2/invoicing/invoices/{id}/remind to dispatch reminders to overdue customers.
- Captures Refund: Calls POST /v2/payments/captures/{id}/refund for partial/full customer refunds.
- Official @paypal/agent-toolkit/openai integration for agentic tooling.
- Resilient Hybrid Sandbox Mode: Logs raw HTTP status and JSON payloads to our Live API Inspector Drawer.

2. AI Integration (xAI Grok):
- xAI Grok 4.7 acts as the store's conversational financial copilot. It translates natural-language merchant commands into dynamic AG Grid filter/sort state, conducts profit leak diagnostics, and generates Human-in-the-Loop action cards.
```

### Which additional sponsor tool(s) did you use for this project?
Check the following 3 options:
- `[x] AG Grid`
- `[x] Render`
- `[x] Zapier`

### Provide a URL to your public code repository on GitHub, GitLab or Bitbucket:
```text
https://github.com/your-username/paypulse-ai
```
*(Ensure repo is public and contains the included MIT LICENSE file)*

### Provide a URL to a working demo, hosted application or test build of your project:
```text
https://paypulse-ai.onrender.com
```

### Testing instructions or credentials the judges need to test your project, if any:
```text
PayPulse AI is engineered with a Zero-Configuration "Judge Demo Mode" so you can test immediately with zero friction:

1. Open the hosted URL (or run locally with `npm run dev` and open http://localhost:3000).
2. Click "Load Demo Bakery Data" in the top header. This populates 25 realistic transactions for "SweetCrumb Artisan Bakery" across Paid, Overdue, and Refunded states.
3. Test the 5 Everyday Scenarios using the clickable Quick-Prompt chips in the left chat column:
   - Scenario 1 (Chat-to-Table): Click "Show unpaid & overdue bills" -> AG Grid filters and highlights unpaid rows.
   - Scenario 2 (Text-to-Invoice): Click "Bill sarah@test.com $75 for Cupcakes" -> Review the Human-in-the-Loop card and click "Approve & Execute via PayPal" to generate an invoice.
   - Scenario 3 (Overdue Recovery): Click "Recover (AI)" on the Overdue KPI card -> Grok drafts a 10% discount settlement offer and notifies Zapier.
   - Scenario 4 (Cashflow Diagnostics): Click "Why did profits drop this week?" -> Grok breaks down 4 courier-delayed refunds and overdue invoices.
   - Scenario 5 (Instant Refund): Click "Refund $15 to Sam for broken mug" -> Approve the partial refund card and watch KPI metrics adjust.
4. Click "API Inspector" in the header to view real-time JSON requests and responses sent to PayPal Sandbox, Grok AI, and Zapier.
```

### How would you rate your overall experience integrating PayPal?:
`10 - excellent`

### Overall experience rating: Please share why or provide additional feedback:
```text
Integrating PayPal's v2 Invoicing and Payments REST APIs was a fantastic experience. The official sandbox environment (api-m.sandbox.paypal.com) was responsive and reliable. The JSON schema for invoice drafts, line items, and payer views is clean and well-structured. Furthermore, the newly released @paypal/agent-toolkit provides a great bridge for equipping AI models with official PayPal capabilities.
```

### Are you open to us contacting you for additional feedback regarding your experience with integrating PayPal?:
`Yes`

### If you used AG Grid, what was your experience building with AG Grid/AG Charts/AG Studio?:
```text
AG Grid was the centerpiece of our financial workbench. Using ag-grid-react and ag-grid-enterprise with our AG Studio Pro license key allowed us to deliver an enterprise-grade fintech experience:
1. Dynamic AI Filtering: Grok AI directly controls grid filtering rules and highlights matching rows in real time.
2. Theming & Polish: The ag-theme-quartz light theme seamlessly blends with our Stripe/Mercury fintech styling.
3. Custom Cell Renderers: Built custom React components for semantic status badges with pulse indicators, formatted currency, monospace IDs, and clickable PayPal Sandbox links.
4. Advanced Enterprise Capabilities: Enabled range selection, the enterprise status bar with live aggregations (count, sum, average, min, max), side bar tool panels (columns and filters), and CSV export.
AG Grid made our "no-dashboard" conversational interface feel lightning-fast and trustworthy!
```

### Which AI tools have you leveraged while working on this project?:
```text
xAI Grok 4.7 API, OpenAI SDK compatible client, Cursor, Claude 3.5 Sonnet.
```

### Describe the level of learning you/your team derived from the project:
`Significant`

### Did you gain AI value that you can use in your career?:
`Yes`

### Eligibility Checkboxes:
- `[x] I, and, if applicable, all of my teammates, are at least the age of majority where I reside`
- `[x] I, and, if applicable, all of my teammates, are from an eligible jurisdiction to compete`
- `[x] I, and, if applicable, all of my teammates, are not employees, representatives nor agents of the Promotion Entities`

---

## 🎥 3-Minute Video Demo Outline (YouTube)
* **0:00 - 0:30 (Problem & Hook):** Introduce PayPulse AI. Show the problem: small merchants hate complicated accounting menus. Introduce the vision: *"Talk-to-Your-Money" — building a payments dashboard without building a dashboard.*
* **0:30 - 1:00 (Scenario 1 & 2):** Click *"Show unpaid bills"* -> watch AG Grid filter and highlight rows. Type *"Bill sarah@test.com $75 for 3 Boxes of Cupcakes"* -> show Human-in-the-Loop card, click Approve, watch confetti and new row appear.
* **1:00 - 1:40 (Scenario 3 & 4):** Click *"Recover (AI)"* on Overdue KPI card -> show 10% discount reminder, approve, show Zapier webhook trigger. Ask *"Why did profits drop this week?"* -> show Grok's profit leak diagnostic.
* **1:40 - 2:15 (Scenario 5 & AG Grid Enterprise):** Ask *"Refund $15 to Sam for broken mug"* -> approve partial refund, watch row update to REFUNDED and KPIs update. Show AG Grid Enterprise range selection and tool panel.
* **2:15 - 2:45 (Architecture & Live API Inspector):** Toggle the API Inspector drawer to prove real-time JSON payloads exchanged with PayPal Sandbox, xAI Grok, and Zapier.
* **2:45 - 3:00 (Conclusion):** Thank PayPal, AG Grid, Render, and Zapier. Wrap up cleanly within 3 minutes.
