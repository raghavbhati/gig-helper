# Saathi (साथी) — GenAI Co-pilot for Gig & Informal Workers

> **Hackathon Submission**: A voice-first, multilingual GenAI assistant designed for delivery partners, cab drivers, and daily-wage laborers to audit earnings, decode tricky contracts, enforce safety, access welfare schemes, and draft policy-backed legal disputes.

---

## 🌟 The Problem
Over 500 million informal and gig workers across the globe face:
1. **Opaque Deductions & Algorithm Penalties**: Unfair delivery cancellation fines, rain delays wrongly charged to riders, and withheld incentives.
2. **Language & Literacy Barriers**: 40-page platform contracts written in complex legal English that bury one-sided termination clauses.
3. **Underutilized Welfare Rights**: Unawareness of government social security nets like e-Shram (₹2 Lakh accidental insurance) and State Gig Worker Welfare Funds.
4. **Vulnerability on the Road**: Extreme heatwaves, monsoon accidents, and no immediate institutional safety line.

---

## 🚀 Key Features

### 1. 💰 Multimodal Earnings & Deduction Auditor
- Upload screenshots of delivery payout slips (Swiggy, Zomato, Uber, Zepto) or daily wage cards.
- Calculates **True Net Take-Home**: `Net = Gross - Fuel - Commission - Penalties`.
- Compares real hourly wage vs. Statutory Minimum Wage.
- Detects unfair weather/traffic deductions and flags them for 1-click appeal.

### 2. ⚖️ 3-Tier Dispute & Grievance Drafter
- Generates 3 tiers of escalation:
  - **Tier 1: In-App Support Chat** (Crisp, polite text).
  - **Tier 2: Operations Management Email** (Formal, evidence-backed appeal).
  - **Tier 3: Statutory Petition to District Labor Commissioner** (Citing the Code on Social Security 2020 & State Gig Worker Acts).
- **1-Click Actions**: Copy to Clipboard, Share via WhatsApp, and **Download Print-Ready PDF Letter** (`jsPDF`).

### 3. 🏛️ Government Rights & Welfare Scheme Navigator
- Curated directory of zero-cost government schemes:
  - **e-Shram Card**: ₹2,00,000 accidental insurance + universal worker ID.
  - **State Gig Workers Welfare Board Fund**: Automatic cess-funded social security & accident relief.
  - **Ayushman Bharat (PM-JAY)**: ₹5 Lakh cashless hospital coverage per family.
  - **PM SVANidhi**: ₹10,000 to ₹50,000 collateral-free microloans with 7% interest rebate.
  - **BOCW Welfare Board**: Construction worker scholarship, tool kits, and marriage assistance.
- **30-Second Eligibility Quiz**: Instantly matches eligible schemes based on age and sector.

### 4. 📄 Document & Contract Plain-Language Explainer
- Decodes legal jargon into **3 Simple Questions**:
  1. *Yeh kagaz kya hai?* (What is this paper?)
  2. *Aapki kamai aur kaam par kya asar padega?* (Impact on your income)
  3. *Aapko abhi kya karna chahiye?* (What action to take now?)
- Highlights **Trap Clauses** (e.g. unilateral account termination, mandatory arbitration).

### 5. 🛡️ Safety Practices & Emergency SOS
- Shift Hazard Advisories (Monsoon waterlogging & braking protocols, Severe heatwave hydration shield).
- **Panic SOS Broadcaster**: 1-click triggers emergency SMS with GPS coordinates.
- On-Duty Road Accident 3-Step Legal & Insurance Checklist.

### 6. 🗣️ Vernacular Voice Co-pilot
- Voice-in via browser speech recognition and voice-out via Web Speech synthesis in English, Hindi, Hinglish, Tamil, Telugu, Kannada, and Bengali.

---

## 🛠️ Quick Start

```bash
# 1. Clone repository & install dependencies
git clone <repo-url>
cd gig-helper
npm install

# 2. (Optional) Add your Gemini API Key in .env.local
echo "GEMINI_API_KEY=your_key_here" > .env.local
# Note: Saathi runs out-of-the-box with built-in realistic AI fallback even without an API key!

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏆 Hackathon Demo Guide (2-Minute Pitch)
1. **Show the Persona & Language Bar**: Switch between Delivery Partner, Cab Driver, and Daily Laborer. Toggle language to Hindi / Hinglish.
2. **Audit an Earnings Slip**: Click *"🛵 Swiggy Rain Fine"*. Point out how gross ₹1,250 drops to ₹60/hr after ₹350 rain fine and fuel.
3. **1-Click Dispute Transition**: Click *"Draft Refund Dispute Notice"*. Show how the data flows automatically into the Dispute Drafter.
4. **Export PDF Notice**: Select *"Tier 3: Labor Board Petition"*, click *"Download PDF"*, and show the generated formal petition with statutory citations.
5. **Interactive Voice Co-pilot**: Click the orange microphone button at the bottom-right, ask a question in Hindi or English, and listen to Saathi respond aloud!
