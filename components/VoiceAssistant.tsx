'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles, X, MessageSquare } from 'lucide-react';
import { Language, Persona, translations } from '@/lib/translations';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  persona: Persona;
  onTransferToDispute?: (text: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isOpen,
  onClose,
  language,
  persona,
  onTransferToDispute,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'gig_kavach'; text: string }>>([
    {
      sender: 'gig_kavach',
      text: language === 'en'
        ? "Namaste! Speak or type your problem in your own language. I am Gig Kavach, your AI legal and financial guardian."
        : "नमस्ते! अपनी भाषा में बोलकर या लिखकर बताइए। मैं गिग कवच (Gig Kavach) के रूप में आपकी कटी हुई पेनल्टी वापस पाने, कमाई चेक करने, या सरकारी बीमा समझने में मदद करूँगा।",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check SpeechRecognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN';

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Could not start recognition:", e);
      }
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop prior audio
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-IN' : 'hi-IN';
    utterance.rate = 0.95;

    // Pick Hindi or Indian voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (targetVoice) utterance.voice = targetVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || transcript;
    if (!text.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user' as const, text }];
    setChatHistory(newHistory);
    setTranscript('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          persona,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data.reply || "आपकी बात समझ ली गई है।";

      setChatHistory([...newHistory, { sender: 'gig_kavach', text: reply }]);
      speakText(reply);
    } catch (err) {
      console.warn("API route unavailable, utilizing intelligent contextual offline fallback:", err);
      const lower = text.toLowerCase();
      let fallbackReply = "नमस्ते! मैं गिग कवच (Gig Kavach) - आपका कानूनी व वित्तीय सुरक्षा कवच हूँ। आप कमाई की जांच, पेनल्टी विवाद, या सरकारी योजनाओं के बारे में कभी भी पूछ सकते हैं।";

      if (lower.includes("penalty") || lower.includes("dispute") || lower.includes("cut") || lower.includes("refund") || lower.includes("पेनल्टी") || lower.includes("काट") || lower.includes("वापस")) {
        fallbackReply = language === 'en'
          ? "Unfair penalty detected! Go to the 'Dispute Drafter' tab above. Gig Kavach will generate a 3-tier grievance petition citing Indian Contract Act & Gig Worker Welfare Rules with an instant PDF download."
          : "अनुचित पेनल्टी! ऊपर दिए गए 'Dispute Drafter' टैब पर जाएँ। गिग कवच आपके लिए भारतीय अनुबंध अधिनियम के तहत 3-स्तरीय शिकायत पत्र और पीडीएफ तुरंत तैयार करेगा।";
      } else if (lower.includes("shram") || lower.includes("welfare") || lower.includes("scheme") || lower.includes("insurance") || lower.includes("bima") || lower.includes("बीमा") || lower.includes("योजना")) {
        fallbackReply = language === 'en'
          ? "You are eligible for e-Shram (₹2 Lakh accidental cover) and Ayushman PM-JAY (₹5 Lakh health cover). Check the 'Welfare Schemes' tab to verify in 30 seconds."
          : "आप ई-श्रम (₹2 लाख मुफ्त दुर्घटना बीमा) और आयुष्मान भारत (₹5 लाख स्वास्थ्य बीमा) के पात्र हैं। 30 सेकंड में पात्रता जानने के लिए ऊपर 'Welfare Schemes' टैब देखें।";
      } else if (lower.includes("block") || lower.includes("id") || lower.includes("account") || lower.includes("आईडी") || lower.includes("ब्लॉक")) {
        fallbackReply = language === 'en'
          ? "Arbitrary deactivation is legally challengeable. Open Dispute Drafter Tier 2 for Operations Management Escalation or Tier 3 for a formal petition to the District Labor Commissioner."
          : "बिना सुनवाई आईडी ब्लॉक करना नियमों के विरुद्ध है। ऑपरेशंस मैनेजमेंट को ईमेल भेजने या लेबर कमिश्नर को कानूनी नोटिस देने के लिए Dispute Drafter का उपयोग करें।";
      } else if (lower.includes("earning") || lower.includes("fuel") || lower.includes("wage") || lower.includes("kamai") || lower.includes("कमाई") || lower.includes("घंटे")) {
        fallbackReply = language === 'en'
          ? "Check the 'Earnings Audit' tab to analyze your real take-home pay after fuel deductions against the statutory ₹95/hr minimum benchmark."
          : "पेट्रोल खर्च और कटौतियों के बाद अपनी असली कमाई की जांच करने के लिए 'Earnings Audit' टैब खोलें। यह ₹95/घंटे की न्यूनतम मजदूरी से मिलान करता है।";
      }

      setChatHistory([
        ...newHistory,
        {
          sender: 'gig_kavach',
          text: fallbackReply,
        },
      ]);
      speakText(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  const presetQueries = [
    {
      label: "Rain Penalty Dispute",
      text: language === 'en' 
        ? "Swiggy cut ₹350 penalty for rain traffic delay. How to get refund?" 
        : "बारिश में जाम की वजह से Swiggy ने ₹350 पेनल्टी काट ली, वापस कैसे मिलेगी?",
    },
    {
      label: "e-Shram Welfare Scheme",
      text: language === 'en'
        ? "How can I get the ₹2 Lakh free accidental insurance from e-Shram?"
        : "ई-श्रम कार्ड से ₹2 लाख का मुफ्त दुर्घटना बीमा कैसे मिलेगा?",
    },
    {
      label: "Account Blocked",
      text: language === 'en'
        ? "Uber temporarily blocked my account without any clear reason. What to do?"
        : "कंपनी ने बिना कोई कारण बताए मेरी आईडी ब्लॉक कर दी है, मैं क्या करूँ?",
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-assistant-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#0d3830] border border-[#174a40] rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 bg-[#0a2e27] border-b border-[#174a40] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0f766e] flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-[#99f6e4]" aria-hidden="true" />
            </div>
            <div>
              <h3 id="voice-assistant-title" className="font-heading font-bold text-sm text-white flex items-center gap-2">
                Gig Kavach Voice Co-pilot
                <span className="text-[10px] bg-[#ccfbf1] text-[#0f766e] px-1.5 py-0.5 rounded font-mono font-bold">
                  LIVE
                </span>
              </h3>
              <p className="text-xs text-[#cfe9e1]">Speak or listen in your vernacular dialect</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => speakText(chatHistory[chatHistory.length - 1]?.text || '')}
              className="p-2 rounded-xl bg-[#0d3830] hover:bg-[#114a40] text-[#99f6e4] hover:text-white transition focus:outline-none focus:ring-2 focus:ring-[#0d9488] border border-[#174a40]"
              title={isSpeaking ? "Stop Voice" : "Listen aloud"}
              aria-label={isSpeaking ? "Stop Voice playback" : "Listen aloud to latest assistant response"}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" aria-hidden="true" /> : <Volume2 className="w-4 h-4 text-[#5eead4]" aria-hidden="true" />}
            </button>
            <button
              onClick={onClose}
              aria-label="Close Voice Assistant dialog"
              className="p-2 rounded-xl bg-[#0d3830] hover:bg-[#114a40] text-[#a7d7cb] hover:text-white transition focus:outline-none focus:ring-2 focus:ring-[#0d9488] border border-[#174a40]"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Chat History Box */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm bg-[#0a2e27]/60">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0d9488] text-white rounded-br-none font-medium'
                    : 'bg-[#0d3830] text-[#f4fbf8] border border-[#174a40] rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'gig_kavach' && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  <button
                    onClick={() => speakText(msg.text)}
                    className="text-[11px] text-[#5eead4] hover:text-white flex items-center gap-1 font-medium"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                  {onTransferToDispute && msg.text.includes("शिकायत") && (
                    <button
                      onClick={() => {
                        onTransferToDispute(chatHistory[idx - 1]?.text || msg.text);
                        onClose();
                      }}
                      className="text-[11px] text-[#2dd4bf] hover:text-white flex items-center gap-1 font-medium underline"
                    >
                      Draft Dispute Form →
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#5eead4] py-1 font-medium">
              <div className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-bounce [animation-delay:0.4s]" />
              <span>Gig Kavach is thinking in {language}...</span>
            </div>
          )}
        </div>

        {/* Preset Query Chips */}
        <div role="group" aria-label="Suggested quick questions" className="px-4 py-2 bg-[#0a2e27] border-t border-[#174a40] flex flex-wrap gap-1.5">
          {presetQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.text)}
              aria-label={`Ask: ${q.label}`}
              className="text-xs bg-[#0d3830] hover:bg-[#114a40] text-[#cfe9e1] hover:text-white px-2.5 py-1 rounded-full border border-[#174a40] transition focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            >
              💬 {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar with Mic & Send */}
        <div className="p-3 bg-[#0a2e27] border-t border-[#174a40] flex items-center gap-2">
          
          <button
            onClick={toggleListening}
            aria-label={isListening ? "Stop listening to speech" : "Start speaking into microphone"}
            className={`p-3 rounded-2xl flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#0d9488] ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                : 'bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-lg shadow-[#0d9488]/30 active:scale-95'
            }`}
            title={isListening ? "Listening... click to stop" : "Click to speak"}
          >
            {isListening ? <MicOff className="w-5 h-5" aria-hidden="true" /> : <Mic className="w-5 h-5" aria-hidden="true" />}
          </button>

          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            aria-label="Speak or type your message"
            placeholder={isListening ? "Listening... speak now" : "Speak or type in Hindi/English/Vernacular..."}
            className="flex-1 bg-[#0d3830] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#174a40] focus:outline-none focus:ring-2 focus:ring-[#0d9488] placeholder:text-[#718882]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!transcript.trim() || isLoading}
            aria-label="Send message to Gig Kavach"
            className="p-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white disabled:opacity-40 disabled:hover:bg-[#0d9488] transition focus:outline-none focus:ring-2 focus:ring-[#0d9488] active:scale-95"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

      </div>
    </div>
  );
};
