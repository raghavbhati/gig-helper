export interface EarningsRecord {
  id: string;
  source: string;
  workerPersona: string;
  date: string;
  grossPay: number;
  ordersOrTrips: number;
  activeHours: number;
  tips: number;
  surge: number;
  deductions: {
    fuelEstimate: number;
    platformCommission: number;
    penalty: number;
    penaltyReason: string;
  };
  netPay: number;
  realHourlyWage: number;
  statutoryMinHourlyWage: number;
  discrepancyAlert: string | null;
  explanationHindi: string;
  explanationEnglish: string;
}

export interface WelfareScheme {
  id: string;
  title: string;
  titleHindi: string;
  category: 'insurance' | 'health' | 'loan' | 'pension' | 'welfare_board';
  eligiblePersonas: string[];
  benefitAmount: string;
  benefitAmountHindi: string;
  eligibilityCriteria: string[];
  documentsRequired: string[];
  officialPortal: string;
  applyStepsHindi: string[];
  applyStepsEnglish: string[];
}

export interface SampleDoc {
  id: string;
  title: string;
  type: 'contract' | 'penalty_notice' | 'insurance_claim' | 'deactivation_warning';
  originalExcerpt: string;
  simplifiedWhatIsIt: string;
  simplifiedImpact: string;
  recommendedAction: string;
  trapWarning: string | null;
}

export const sampleEarningsPresets: EarningsRecord[] = [
  {
    id: 'swiggy-rain-penalty',
    source: 'Swiggy Delivery Partner Daily Slip',
    workerPersona: 'delivery',
    date: 'Yesterday (Monsoon Shift)',
    grossPay: 1250,
    ordersOrTrips: 14,
    activeHours: 11,
    tips: 80,
    surge: 120,
    deductions: {
      fuelEstimate: 320,
      platformCommission: 0,
      penalty: 350,
      penaltyReason: 'Order #SW-9481 Customer Reported Late Delivery (>45 min)',
    },
    netPay: 660,
    realHourlyWage: 60.0,
    statutoryMinHourlyWage: 95.0,
    discrepancyAlert: 'Unfair Penalty Detected: Weather data shows severe waterlogging in your delivery sector at 20:15. Delay was caused by force majeure weather, not rider negligence.',
    explanationHindi: 'आपने 11 घंटे काम किया और ₹1250 कमाए। लेकिन ₹320 पेट्रोल और ₹350 की गलत पेनल्टी कटने के बाद आपको सिर्फ ₹660 मिले (यानी केवल ₹60/घंटा, जो सरकारी न्यूनतम वेतन ₹95 से बहुत कम है)। बारिश की वजह से कटी पेनल्टी वापस मांगी जा सकती है।',
    explanationEnglish: 'You worked 11 hours for ₹1250 gross. After ₹320 fuel and an unfair ₹350 penalty, your take-home was only ₹660 (₹60/hr vs statutory minimum ₹95/hr). The penalty was incurred during heavy monsoon waterlogging and is eligible for full refund.',
  },
  {
    id: 'uber-cancellation-clawback',
    source: 'Uber Driver Weekly Payout Summary',
    workerPersona: 'driver',
    date: 'Last 7 Days',
    grossPay: 8400,
    ordersOrTrips: 42,
    activeHours: 54,
    tips: 340,
    surge: 650,
    deductions: {
      fuelEstimate: 2900,
      platformCommission: 1680,
      penalty: 500,
      penaltyReason: 'Driver Cancellation Rate Exceeded 8% Threshold',
    },
    netPay: 3660,
    realHourlyWage: 67.7,
    statutoryMinHourlyWage: 95.0,
    discrepancyAlert: 'Clawback Dispute: 3 of your cancelled rides were initiated because riders demanded unauthorized off-platform stops or had excess passengers.',
    explanationHindi: '54 घंटे गाड़ी चलाने के बाद कमीशन (₹1680), सीएनजी (₹2900) और ₹500 पेनल्टी काटकर आपके पास केवल ₹3660 बचे। कैंसिलेशन पेनल्टी गलत लगी है क्योंकि सवारी गलत रूट की मांग कर रही थी।',
    explanationEnglish: 'After 54 hours of driving, platform commission (₹1680), fuel (₹2900), and a ₹500 penalty left you with only ₹3660 net (₹67.70/hr). The cancellation fee can be contested as passengers violated safety rules.',
  },
  {
    id: 'construction-wage-cut',
    source: 'Site Contractor Daily Muster Roll',
    workerPersona: 'daily_wage',
    date: 'Current Week',
    grossPay: 4200,
    ordersOrTrips: 6,
    activeHours: 60,
    tips: 0,
    surge: 0,
    deductions: {
      fuelEstimate: 180,
      platformCommission: 0,
      penalty: 700,
      penaltyReason: 'Late Reporting & Material Handling Deduction',
    },
    netPay: 3320,
    realHourlyWage: 55.3,
    statutoryMinHourlyWage: 95.0,
    discrepancyAlert: 'Illegal Wage Deduction: Section 7 of the Payment of Wages Act strictly forbids arbitrary material breakage deductions without prior show-cause inquiry.',
    explanationHindi: 'ठेकेदार ने ₹700 बिना किसी नोटिस के सामान टूटने के नाम पर काट लिए। कानूनन मजदूरी में से ऐसा मनमाना पैसा काटना गैरकानूनी है। आप लेबर इंस्पेक्टर को शिकायत भेज सकते हैं।',
    explanationEnglish: 'Contractor withheld ₹700 for alleged material damage without inquiry. Under Payment of Wages Act Sec 7, arbitrary wage deductions are illegal and reportable to the local labor officer.',
  },
];

export const sampleWelfareSchemes: WelfareScheme[] = [
  {
    id: 'e-shram',
    title: 'e-Shram Universal Unorganized Worker Card',
    titleHindi: 'ई-श्रम कार्ड (असंगठित कर्मकार पंजीकरण)',
    category: 'insurance',
    eligiblePersonas: ['delivery', 'driver', 'daily_wage'],
    benefitAmount: '₹2,00,000 Accidental Death / Permanent Disability Cover',
    benefitAmountHindi: '₹2 लाख दुर्घटना बीमा + सरकारी योजनाओं का सीधा लाभ',
    eligibilityCriteria: [
      'Age between 16 and 59 years',
      'Not paying Income Tax',
      'Not an EPFO / ESIC formal employee',
      'Works in unorganized or gig platform sector',
    ],
    documentsRequired: [
      'Aadhaar Card linked with active mobile number',
      'Bank Account passbook or account number + IFSC',
      'Age proof / Self declaration of unorganized worker',
    ],
    officialPortal: 'eshram.gov.in',
    applyStepsHindi: [
      '1. e-Shram पोर्टल पर आधार नंबर और OTP दर्ज करें।',
      '2. अपनी पेशा श्रेणी चुनें (जैसे 5321: मोटरसाइकिल डिलीवरी राइडर या 8322: कैब ड्राइवर)।',
      '3. बैंक खाता विवरण डालें और 12 अंकों का UAN कार्ड तुरंत डाउनलोड करें।',
    ],
    applyStepsEnglish: [
      '1. Enter Aadhaar and mobile OTP on eshram.gov.in.',
      '2. Select occupation code (e.g. 5321 for Delivery Courier or 8322 for Taxi Driver).',
      '3. Provide active bank details and download your 12-digit UAN Card immediately.',
    ],
  },
  {
    id: 'gig-welfare-board',
    title: 'State Platform Gig Workers Welfare Board Fund',
    titleHindi: 'राज्य गिग वर्कर्स कल्याण बोर्ड (राजस्थान / कर्नाटक मॉडल)',
    category: 'welfare_board',
    eligiblePersonas: ['delivery', 'driver'],
    benefitAmount: 'Automated Social Security Cess + Accident & Medical Relief Fund',
    benefitAmountHindi: 'हर ट्रांजेक्शन से जमा सेस + मुफ्त दुर्घटना सहायता और शिकायत ट्रिब्यूनल',
    eligibilityCriteria: [
      'Active onboarding with platforms like Swiggy, Zomato, Uber, Ola, Zepto, Blinkit',
      'Working within state territorial boundary',
      'Unique Gig Worker ID generated via platform aggregator portal',
    ],
    documentsRequired: [
      'Platform Partner ID / screenshot of active profile',
      'Aadhaar card',
      'Local address proof / bank passbook',
    ],
    officialPortal: 'labour.rajasthan.gov.in',
    applyStepsHindi: [
      '1. एग्रीगेटर ऐप (Swiggy/Uber) आपकी हर ट्रिप पर 1-2% वेलफेयर सेस सरकारी फंड में जमा करती है।',
      '2. वेलफेयर बोर्ड पोर्टल पर अपना पार्टनर आईडी लिंक करें।',
      '3. दुर्घटना या मनमाने डीएक्टिवेशन पर आप सीधे वेलफेयर ट्रिब्यूनल में अपील दायर कर सकते हैं।',
    ],
    applyStepsEnglish: [
      '1. Aggregators deduct 1-2% welfare cess per trip directly into the government welfare pool.',
      '2. Register and link your Partner ID on the state portal.',
      '3. Access emergency medical grants and appellate authority against unfair deactivation.',
    ],
  },
  {
    id: 'pm-jay',
    title: 'Ayushman Bharat (PM-JAY)',
    titleHindi: 'आयुष्मान भारत (PM-JAY) स्वास्थ्य कार्ड',
    category: 'health',
    eligiblePersonas: ['delivery', 'driver', 'daily_wage'],
    benefitAmount: '₹5,00,000 Cashless Hospitalization per Family/Year',
    benefitAmountHindi: '₹5 लाख तक का मुफ्त अस्पताल इलाज प्रति वर्ष (पूरे परिवार के लिए)',
    eligibilityCriteria: [
      'Listed under SECC 2011 unorganized/deprived criteria or eligible ration card holder',
      'No formal private employer medical insurance',
    ],
    documentsRequired: [
      'Ration Card / Family ID',
      'Aadhaar Card of all family members',
      'Active Mobile number',
    ],
    officialPortal: 'beneficiary.nha.gov.in',
    applyStepsHindi: [
      '1. beneficiary.nha.gov.in पर राशन कार्ड या आधार से पात्रता चेक करें।',
      '2. नजदीकी सरकारी अस्पताल या CSC केंद्र पर e-KYC करवाएं।',
      '3. तुरंत प्लास्टिक/डिजिटल गोल्डन कार्ड पाएं और सूचीबद्ध अस्पतालों में कैशलेस इलाज लें।',
    ],
    applyStepsEnglish: [
      '1. Check eligibility at beneficiary.nha.gov.in using Ration Card or Aadhaar.',
      '2. Complete biometric e-KYC at nearest government hospital or CSC center.',
      '3. Download Ayushman Golden Card for 100% cashless treatment at empaneled private/govt hospitals.',
    ],
  },
  {
    id: 'pm-svanidhi',
    title: 'PM SVANidhi Micro Credit Scheme',
    titleHindi: 'पीएम स्वनिधि योजना (सस्ता कार्यशील पूंजी लोन)',
    category: 'loan',
    eligiblePersonas: ['daily_wage', 'delivery', 'driver'],
    benefitAmount: '₹10,000 to ₹50,000 Collateral-Free Loan @ 7% Interest Subsidy',
    benefitAmountHindi: '₹10,000 से ₹50,000 तक बिना गारंटी का लोन + 7% ब्याज सब्सिडी',
    eligibilityCriteria: [
      'Engaged in street vending, independent delivery delivery, or informal trade prior to March 2020/recent updates',
      'Possesses Urban Local Body (ULB) recommendation or platform verification',
    ],
    documentsRequired: [
      'Vending Certificate or Platform Partner onboarding slip',
      'Aadhaar & Bank Account',
    ],
    officialPortal: 'pmsvanidhi.mohua.gov.in',
    applyStepsHindi: [
      '1. स्वनिधि पोर्टल या नजदीकी बैंक में आवेदन जमा करें।',
      '2. पहले चरण में ₹10,000 का लोन प्राप्त करें।',
      '3. समय पर चुकाने पर 7% ब्याज सब्सिडी और अगले चरण में ₹20,000 व ₹50,000 का लोन स्वतः मंजूर होगा।',
    ],
    applyStepsEnglish: [
      '1. Apply on pmsvanidhi.mohua.gov.in or visit any public sector bank.',
      '2. Receive 1st tranche of ₹10,000 without any collateral or guarantor.',
      '3. Prompt digital repayment qualifies for 7% interest rebate and subsequent ₹20k & ₹50k tranches.',
    ],
  },
  {
    id: 'bocw-welfare',
    title: 'BOCW Construction Workers Welfare Board',
    titleHindi: 'भवन एवं अन्य सन्निर्माण कर्मकार (BOCW) कल्याण बोर्ड',
    category: 'welfare_board',
    eligiblePersonas: ['daily_wage'],
    benefitAmount: 'Child Education Grants, Maternity Aid, Free Tool Kits & Accidental Cover',
    benefitAmountHindi: 'बच्चों की छात्रवृत्ति (₹10k-₹25k), प्रसूति सहायता (₹21k), औजार किट व सुरक्षा बीमा',
    eligibilityCriteria: [
      'Worked at least 90 days in construction/masonry/painting/carpentry during the previous 12 months',
      'Age between 18 and 60 years',
    ],
    documentsRequired: [
      '90-day work certificate from registered contractor or trade union',
      'Aadhaar card & 2 passport photos',
      'Bank passbook photocopy',
    ],
    officialPortal: 'bocw.gov.in',
    applyStepsHindi: [
      '1. ठेकेदार या यूनियन से 90 दिन के काम का प्रमाण पत्र लें।',
      '2. जिला श्रम कार्यालय या e-District पोर्टल पर फॉर्म भरें।',
      '3. लाल डायरी (पंजीकरण पासबुक) प्राप्त करें और औजार व शादी सहायता अनुदान का लाभ लें।',
    ],
    applyStepsEnglish: [
      '1. Obtain 90-day employment slip from site supervisor or trade union.',
      '2. Submit registration at District Labor Office or state e-District portal.',
      '3. Receive registered passbook to claim annual tool grants, daughter wedding assistance, and child scholarships.',
    ],
  },
];

export const sampleDocuments: SampleDoc[] = [
  {
    id: 'swiggy-arbitrary-termination',
    title: 'Platform Agreement: Clause 11.2 (Unilateral Account Suspension)',
    type: 'contract',
    originalExcerpt: 'The Platform reserves the unconditional right to suspend, throttle, or terminate the Delivery Partner’s account immediately without prior notice or assignment of cause in the event of customer dissatisfaction, anomalous GPS divergence, or algorithmic score degradation.',
    simplifiedWhatIsIt: 'यह क्लॉज कंपनी को आपका अकाउंट बिना किसी पूर्व सूचना या कारण बताए कभी भी बंद करने का अधिकार देता है।',
    simplifiedImpact: 'यदि किसी ग्राहक ने झूठी शिकायत की या आपके फोन का जीपीएस कमजोर होने से रूट बदला, तो कंपनी बिना आपकी बात सुने आपकी आईडी ब्लॉक कर सकती है।',
    recommendedAction: 'हमेशा हर डिलीवर किए गए ऑर्डर के दरवाजे की फोटो और कस्टमर चैट का स्क्रीनशॉट अपने फोन में 48 घंटे तक सेव रखें ताकि अपील में सबूत दे सकें।',
    trapWarning: '⚠️ चेतावनी: यह क्लॉज एकतरफा है। भारतीय श्रम आयोग और नए गिग वर्कर नियमों के अनुसार बिना कारण बताए डीएक्टिवेशन को चुनौती दी जा सकती है।',
  },
  {
    id: 'medical-insurance-fine-print',
    title: 'Platform Group Accident Insurance: Clause 4.8 (Active Shift Exclusion)',
    type: 'insurance_claim',
    originalExcerpt: 'Accidental injury coverage under this policy is strictly limited to incidents occurring while the Delivery Executive has an active order allocated on the mobile application and is en route between the designated merchant location and the customer doorstep.',
    simplifiedWhatIsIt: 'यह बीमा केवल तभी लागू होगा जब आपके हाथ में एक्टिव आर्डर हो और आप दुकान से ग्राहक के घर की तरफ जा रहे हों।',
    simplifiedImpact: 'यदि आप एक आर्डर पूरा करके अगले आर्डर का इंतजार कर रहे हैं या खाली बाइक चला रहे हैं, तो दुर्घटना होने पर कंपनी बीमा कंपनी को पैसे देने से मना कर सकती है।',
    recommendedAction: 'दुर्घटना होते ही सबसे पहले अपने साथी राइडर से ऐप का स्क्रीनशॉट लेने को कहें जिसमें आर्डर स्थिति स्पष्ट दिखे, और सरकारी अस्पताल में एमएलसी (MLC) तुरंत दर्ज कराएं।',
    trapWarning: '⚠️ भारी जोखिम: खाली समय या पेट्रोल पंप पर हुई टक्कर को कंपनी बीमा में कवर नहीं मानती। इसलिए तुरंत e-Shram कार्ड बनवाएं जो 24 घंटे कवर देता है।',
  },
  {
    id: 'uber-arbitration-waiver',
    title: 'Driver Partner Agreement: Dispute Resolution & Arbitration',
    type: 'deactivation_warning',
    originalExcerpt: 'The Driver irrevocably waives the right to participate in or initiate class actions or collective court petitions against the Company. Any dispute shall be referred solely to sole arbitration seated in Gurugram / Bengaluru, conducted under UNCITRAL rules.',
    simplifiedWhatIsIt: 'यह कंपनी आपसे अदालत जाने या बाकी ड्राइवरों के साथ मिलकर यूनियन केस दर्ज करने का हक छीनने की कोशिश करती है।',
    simplifiedImpact: 'यदि आपके ₹20,000 भी अटक जाएं, तो आपको अकेले बड़े महंगे आर्बिट्रेटर के पास बेंगलुरु जाना पड़ेगा, जो आम ड्राइवर के लिए नामुमकिन है।',
    recommendedAction: 'ऐसे मामलों में सीधे अपने राज्य के उपभोक्ता फोरम (Consumer Forum) या गिग वर्कर्स यूनियन के जरिए लेबर कमिश्नर को शिकायत करें।',
    trapWarning: '⚖️ कानूनी स्थिति: उपभोक्ता संरक्षण अधिनियम 2019 के तहत अनफेयर कॉन्ट्रैक्ट टर्म्स को कोर्ट अमान्य घोषित कर सकता है।',
  },
];
