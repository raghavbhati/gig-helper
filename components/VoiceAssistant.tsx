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
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'saathi'; text: string }>>([
    {
      sender: 'saathi',
      text: language === 'en'
        ? "Namaste! Speak or type your problem in your own language. I can audit your earnings, write dispute letters, or explain government welfare schemes."
        : "नमस्ते साथी! अपनी भाषा में बोलकर या लिखकर बताइए। मैं आपकी कटी हुई पेनल्टी वापस पाने, कमाई चेक करने, या सरकारी बीमा समझने में मदद करूँगा।",
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

      const data = await res.json();
      const reply = data.reply || "Aapki request samajh li gayi hai.";

      setChatHistory([...newHistory, { sender: 'saathi', text: reply }]);
      speakText(reply);
    } catch (err) {
      console.error(err);
      setChatHistory([
        ...newHistory,
        {
          sender: 'saathi',
          text: "Technical hiccup! But don't worry, you can check our Dispute or Welfare tabs directly above.",
        },
      ]);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Saathi Voice Co-pilot
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  LIVE
                </span>
              </h3>
              <p className="text-xs text-slate-400">Speak or listen in your vernacular dialect</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => speakText(chatHistory[chatHistory.length - 1]?.text || '')}
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title={isSpeaking ? "Stop Voice" : "Listen aloud"}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat History Box */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-orange-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700/70 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'saathi' && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  <button
                    onClick={() => speakText(msg.text)}
                    className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-medium"
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
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium underline"
                    >
                      Draft Dispute Form →
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-orange-400 py-1 font-medium">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.4s]" />
              <span>Saathi is thinking in {language}...</span>
            </div>
          )}
        </div>

        {/* Preset Query Chips */}
        <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex flex-wrap gap-1.5">
          {presetQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.text)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition"
            >
              💬 {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar with Mic & Send */}
        <div className="p-3 bg-slate-800 border-t border-slate-700/80 flex items-center gap-2">
          
          <button
            onClick={toggleListening}
            className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30'
            }`}
            title={isListening ? "Listening... click to stop" : "Click to speak"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? "Listening... speak now" : "Speak or type in Hindi/English/Vernacular..."}
            className="flex-1 bg-slate-900 text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!transcript.trim() || isLoading}
            className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white disabled:opacity-40 disabled:hover:bg-orange-600 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
