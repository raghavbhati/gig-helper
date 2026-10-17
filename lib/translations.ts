export type Language = 'en' | 'hi' | 'hinglish' | 'ta' | 'te' | 'kn' | 'bn';
export type Persona = 'delivery' | 'driver' | 'daily_wage';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  selectPersona: string;
  personas: {
    delivery: string;
    driver: string;
    daily_wage: string;
  };
  tabs: {
    earnings: string;
    dispute: string;
    welfare: string;
    docs: string;
    safety: string;
  };
  voiceButtonStart: string;
  voiceButtonStop: string;
  voiceListening: string;
  audioPlay: string;
  audioStop: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appName: "Saathi (साथी)",
    tagline: "Your AI Guardian & Advocate for Gig & Daily Wage Rights",
    selectPersona: "Select Your Work",
    personas: {
      delivery: "Delivery Partner (Swiggy / Zomato / Zepto)",
      driver: "Driver / Cab / Auto (Uber / Ola / Rapido)",
      daily_wage: "Daily Wage / Construction / Domestic",
    },
    tabs: {
      earnings: "Earnings Audit",
      dispute: "Dispute Drafter",
      welfare: "Welfare Schemes",
      docs: "Document Explainer",
      safety: "Safety & SOS",
    },
    voiceButtonStart: "Speak to Saathi",
    voiceButtonStop: "Stop Listening",
    voiceListening: "Listening... speak now in your own language",
    audioPlay: "Listen in Voice",
    audioStop: "Stop Audio",
  },
  hi: {
    appName: "साथी (Saathi)",
    tagline: "गिग और दैनिक वेतन श्रमिकों के अधिकारों का AI रक्षक",
    selectPersona: "अपना काम चुनें",
    personas: {
      delivery: "डिलीवरी पार्टनर (Swiggy / Zomato / Zepto)",
      driver: "ड्राइवर / कैब / ऑटो (Uber / Ola / Rapido)",
      daily_wage: "दैनिक वेतन / निर्माण / घरेलू सहायक",
    },
    tabs: {
      earnings: "कमाई और कटौती जांच",
      dispute: "शिकायत पत्र लिखें",
      welfare: "सरकारी योजनाएं",
      docs: "दस्तावेज़ समझें",
      safety: "सुरक्षा और SOS",
    },
    voiceButtonStart: "साथी से बोलकर पूछें",
    voiceButtonStop: "सुनना बंद करें",
    voiceListening: "सुन रहे हैं... अपनी भाषा में बोलिए",
    audioPlay: "आवाज़ में सुनें",
    audioStop: "आवाज़ रोकें",
  },
  hinglish: {
    appName: "Saathi (साथी)",
    tagline: "Aapka Pocket AI Advocate - Kamai, Rights aur Safety ke liye",
    selectPersona: "Apna Kaam Choose Karein",
    personas: {
      delivery: "Delivery Partner (Swiggy / Zomato / Zepto)",
      driver: "Driver / Cab / Auto (Uber / Ola / Rapido)",
      daily_wage: "Daily Wage / Mistri / Domestic Helper",
    },
    tabs: {
      earnings: "Earnings & Penalty Check",
      dispute: "Dispute & Complaint Drafter",
      welfare: "Sarkari Schemes & Rights",
      docs: "Paperwork & Notice Explainer",
      safety: "Safety & Emergency SOS",
    },
    voiceButtonStart: "Bolkar Baat Karein",
    voiceButtonStop: "Stop Karein",
    voiceListening: "Sun rahe hain... boliye kya problem hai",
    audioPlay: "Voice me Sunein",
    audioStop: "Stop Audio",
  },
  ta: {
    appName: "சாத்தி (Saathi)",
    tagline: "கிக் & தினக்கூலி தொழிலாளர்களுக்கான AI பாதுகாவலர்",
    selectPersona: "உங்கள் பணியைத் தேர்ந்தெடுக்கவும்",
    personas: {
      delivery: "டெலிவரி பார்ட்னர் (Swiggy / Zomato)",
      driver: "ஓட்டுநர் / கேப் / ஆட்டோ (Uber / Ola)",
      daily_wage: "தினக்கூலி / கட்டுமானத் தொழிலாளி",
    },
    tabs: {
      earnings: "வருவாய் தணிக்கை",
      dispute: "புகார் கடிதம்",
      welfare: "அரசு நலத்திட்டங்கள்",
      docs: "ஆவண விளக்கம்",
      safety: "பாதுகாப்பு & அவசர உதவி",
    },
    voiceButtonStart: "பேசவும்",
    voiceButtonStop: "நிறுத்து",
    voiceListening: "கேட்கிறது... பேசவும்",
    audioPlay: "குரலில் கேட்கவும்",
    audioStop: "நிறுத்து",
  },
  te: {
    appName: "సాథీ (Saathi)",
    tagline: "గిగ్ & దినసరి వేతన కార్మికుల హక్కుల AI రక్షకుడు",
    selectPersona: "మీ పనిని ఎంచుకోండి",
    personas: {
      delivery: "డెలివరీ పార్టనర్ (Swiggy / Zomato)",
      driver: "డ్రైవర్ / క్యాబ్ / ఆటో (Uber / Ola)",
      daily_wage: "దినసరి వేతనం / భవన నిర్మాణ కార్మికుడు",
    },
    tabs: {
      earnings: "ఆదాయం & తగ్గింపుల తనిఖీ",
      dispute: "ఫిర్యాదు లేఖ",
      welfare: "ప్రభుత్వ పథకాలు",
      docs: "పత్రాల వివరణ",
      safety: "భద్రత & SOS",
    },
    voiceButtonStart: "మాట్లాడండి",
    voiceButtonStop: "ఆపండి",
    voiceListening: "వింటోంది... మాట్లాడండి",
    audioPlay: "వాయిస్‌లో వినండి",
    audioStop: "ఆపండి",
  },
  kn: {
    appName: "ಸಾಥಿ (Saathi)",
    tagline: "ಗಿಗ್ & ದಿನಗೂಲಿ ಕಾರ್ಮಿಕರ ಹಕ್ಕುಗಳ AI ರಕ್ಷಕ",
    selectPersona: "ನಿಮ್ಮ ಕೆಲಸವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    personas: {
      delivery: "ಡೆಲಿವರಿ ಪಾರ್ಟ್ನರ್ (Swiggy / Zomato)",
      driver: "ಡ್ರೈವರ್ / ಕ್ಯಾಬ್ / ಆಟೋ (Uber / Ola)",
      daily_wage: "ದಿನಗೂಲಿ / ಕಟ್ಟಡ ಕಾರ್ಮಿಕ",
    },
    tabs: {
      earnings: "ಗಳಿಕೆ ಮತ್ತು ದಂಡ ಪರಿಶೀಲನೆ",
      dispute: "ದೂರು ಪತ್ರ",
      welfare: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      docs: "ದಾಖಲೆಗಳ ವಿವರಣೆ",
      safety: "ಸುರಕ್ಷತೆ ಮತ್ತು SOS",
    },
    voiceButtonStart: "ಮಾತನಾಡಿ",
    voiceButtonStop: "ನಿಲ್ಲಿಸಿ",
    voiceListening: "ಕೇಳುತ್ತಿದೆ... ಮಾತನಾಡಿ",
    audioPlay: "ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ",
    audioStop: "ನಿಲ್ಲಿಸಿ",
  },
  bn: {
    appName: "সাথী (Saathi)",
    tagline: "গিগ ও দিনমজুর শ্রমিকদের অধিকারের AI রক্ষক",
    selectPersona: "আপনার পেশা বেছে নিন",
    personas: {
      delivery: "ডেলিভারি পার্টনার (Swiggy / Zomato)",
      driver: "ড্রাইভার / ক্যাব / অটো (Uber / Ola)",
      daily_wage: "দিনমজুর / নির্মাণ শ্রমিক / গৃহকর্মী",
    },
    tabs: {
      earnings: "উপার্জন ও জরিমানা যাচাই",
      dispute: "অভিযোগ পত্র তৈরি",
      welfare: "সরকারি কল্যাণমূলক প্রকল্প",
      docs: "নথিপত্র ব্যাখ্যা",
      safety: "সুরক্ষা ও জরুরি SOS",
    },
    voiceButtonStart: "কথা বলুন",
    voiceButtonStop: "থামুন",
    voiceListening: "শুনছি... বলুন",
    audioPlay: "ভয়েসে শুনুন",
    audioStop: "থামুন",
  },
};
