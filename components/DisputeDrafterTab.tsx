'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Language, Persona } from '@/lib/translations';
import {
  Scale,
  Send,
  Download,
  Copy,
  Check,
  Share2,
  FileText,
  Building2,
  MessageSquare,
  ShieldCheck,
  Volume2,
  Sparkles,
  Mic,
  MicOff,
} from 'lucide-react';

interface DisputeDrafterTabProps {
  language: Language;
  persona: Persona;
  prefillData?: {
    platform: string;
    description: string;
    amount: string;
    orderId: string;
  } | null;
}

export const DisputeDrafterTab: React.FC<DisputeDrafterTabProps> = ({
  language,
  persona,
  prefillData,
}) => {
  const [platform, setPlatform] = useState(prefillData?.platform || 'Swiggy');
  const [orderId, setOrderId] = useState(prefillData?.orderId || 'SW-9481');
  const [amount, setAmount] = useState(prefillData?.amount || '350');
  const [workerName, setWorkerName] = useState('Raju Kumar (Delivery Partner)');
  const [workerPhone, setWorkerPhone] = useState('9876543210');
  const [description, setDescription] = useState(
    prefillData?.description ||
      'Heavy monsoon waterlogging caused traffic blockage on delivery route. Customer marked delayed order and Swiggy penalized ₹350 without human review.'
  );

  const [activeTier, setActiveTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier2');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isListeningIncident, setIsListeningIncident] = useState(false);

  const [draftResult, setDraftResult] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

  // Setup speech recognition for the incident textarea
  useEffect(() => {
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
          setDescription(text);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error in Dispute:', event.error);
          setIsListeningIncident(false);
        };

        recognition.onend = () => {
          setIsListeningIncident(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleListeningIncident = () => {
    if (isListeningIncident) {
      recognitionRef.current?.stop();
      setIsListeningIncident(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListeningIncident(true);
      } catch (e) {
        console.warn('Could not start speech recognition:', e);
      }
    }
  };

  // Update when prefillData changes
  useEffect(() => {
    if (prefillData) {
      if (prefillData.platform) setPlatform(prefillData.platform);
      if (prefillData.amount) setAmount(prefillData.amount);
      if (prefillData.orderId) setOrderId(prefillData.orderId);
      if (prefillData.description) setDescription(prefillData.description);
    }
  }, [prefillData]);

  // Initial draft generation or on-demand
  const handleGenerateDispute = async () => {
    setIsDrafting(true);
    try {
      const res = await fetch('/api/draft-dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentDescription: description,
          platformName: platform,
          orderOrTicketId: orderId,
          workerName,
          workerPhone,
          workerPersona: persona,
          deductionAmount: amount,
        }),
      });

      const data = await res.json();
      setDraftResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDrafting(false);
    }
  };

  // Auto generate on first load if not present
  useEffect(() => {
    if (!draftResult) {
      handleGenerateDispute();
    }
  }, []);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!draftResult) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("FORMAL GRIEVANCE & DISPUTE PETITION", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date of Filing: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Aggregator / Respondent: ${platform}`, 14, 34);
    doc.text(`Complainant: ${workerName} (Phone: ${workerPhone})`, 14, 40);
    doc.text(`Reference Order/Ticket ID: ${orderId} | Disputed Penalty: INR ${amount}`, 14, 46);

    doc.line(14, 50, 196, 50);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("STATEMENT OF APPEAL & FACTS:", 14, 58);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const content = activeTier === 'tier3'
      ? draftResult.laborCommissionerPetition?.body
      : draftResult.officialEscalationEmail?.body || draftResult.inAppSupportMessage;

    const splitText = doc.splitTextToSize(content || '', 180);
    doc.text(splitText, 14, 66);

    // Footer
    const endY = 66 + (splitText.length * 5) + 15;
    if (endY < 270) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text("Generated by Gig Kavach (AI Guardian for Unorganized & Gig Workers)", 14, endY);
      doc.text("Verification & Digital Timestamp: " + new Date().toISOString(), 14, endY + 6);
    }

    doc.save(`GigKavach_Dispute_${platform}_${orderId}.pdf`);
  };

  const handleWhatsAppShare = (text: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const speakActiveText = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = activeTier === 'tier1'
      ? draftResult?.inAppSupportMessage
      : activeTier === 'tier2'
      ? draftResult?.officialEscalationEmail?.body
      : draftResult?.laborCommissionerPetition?.body;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2ece9]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-heading font-bold text-[#102a24] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#0d9488]" />
              <span>Grievance, Penalty & Deactivation Dispute Drafter</span>
              <span className="text-xs bg-[#ccfbf1] text-[#0f766e] font-bold px-2 py-0.5 rounded-full border border-[#99f6e4]">
                Legal AI Engine
              </span>
            </h2>
            <p className="text-xs text-[#5a736d] mt-1">
              Transforms your street explanation into multi-tier, policy-backed legal letters citing the Code on Social Security 2020 & Platform Worker Rules.
            </p>
          </div>

          <button
            onClick={handleGenerateDispute}
            disabled={isDrafting}
            className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#99f6e4]" />
            <span>{isDrafting ? 'Drafting Escalations...' : 'Re-Draft Notice'}</span>
          </button>
        </div>

        {/* Input Details Grid */}
        <div className="mt-4 pt-4 border-t border-[#e2ece9] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          
          <div>
            <label className="font-semibold text-[#102a24] block mb-1">Company / Platform</label>
            <input
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="Swiggy, Zomato, Uber, Zepto..."
              className="w-full bg-[#f4fbf8] px-3 py-2 rounded-xl border border-[#d1deda] focus:outline-none focus:ring-2 focus:ring-[#0d9488] font-medium text-[#102a24]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#102a24] block mb-1">Order / Trip / Ticket #</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. SW-9481"
              className="w-full bg-[#f4fbf8] px-3 py-2 rounded-xl border border-[#d1deda] focus:outline-none focus:ring-2 focus:ring-[#0d9488] font-medium text-[#102a24]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#102a24] block mb-1">Deducted / Withheld (₹)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="₹350"
              className="w-full bg-[#f4fbf8] px-3 py-2 rounded-xl border border-[#d1deda] focus:outline-none focus:ring-2 focus:ring-[#0d9488] font-medium text-rose-600 font-bold"
            />
          </div>

          <div>
            <label className="font-semibold text-[#102a24] block mb-1">Worker Name & Phone</label>
            <input
              type="text"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              placeholder="Your Name (Phone)"
              className="w-full bg-[#f4fbf8] px-3 py-2 rounded-xl border border-[#d1deda] focus:outline-none focus:ring-2 focus:ring-[#0d9488] font-medium text-[#102a24]"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-[#102a24] flex items-center gap-1.5 text-xs">
                <span>What Happened? (You can type or speak simply)</span>
              </label>

              {/* Dedicated Mic Button */}
              <button
                type="button"
                onClick={toggleListeningIncident}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isListeningIncident
                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                    : 'bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-[#0d9488]/20'
                }`}
                title={isListeningIncident ? 'Listening... click to stop' : 'Click to speak your problem'}
              >
                {isListeningIncident ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Listening... बोलिए (Stop)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-[#99f6e4]" />
                    <span>बोलकर बताएं / Speak via Mic</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred, traffic delay, customer dispute, bad weather, or arbitrary block..."
                className={`w-full bg-[#f4fbf8] px-3.5 py-2.5 pr-12 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0d9488] text-xs sm:text-sm text-[#102a24] font-medium transition ${
                  isListeningIncident
                    ? 'border-rose-400 ring-2 ring-rose-300/40 bg-rose-50/20'
                    : 'border-[#d1deda]'
                }`}
              />

              {/* Secondary Floating Mic inside Textarea */}
              <button
                type="button"
                onClick={toggleListeningIncident}
                className={`absolute right-2.5 bottom-3 p-2 rounded-xl transition ${
                  isListeningIncident
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-200 hover:bg-[#0d9488] hover:text-white text-slate-600'
                }`}
                title="Toggle microphone"
              >
                {isListeningIncident ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick 1-Click Incident Templates */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 font-semibold">Quick Scenarios:</span>
              <button
                type="button"
                onClick={() =>
                  setDescription(
                    'Heavy monsoon waterlogging caused massive traffic blockage on delivery route. Customer marked delayed order and Swiggy penalized ₹350 unfairly without checking GPS weather telemetry.'
                  )
                }
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200 transition"
              >
                🌧️ Monsoon Traffic Delay
              </button>
              <button
                type="button"
                onClick={() =>
                  setDescription(
                    'Passenger insisted on unauthorized off-app route stops and excess baggage. When driver declined due to safety regulations, passenger falsely cancelled and platform levied cancellation penalty.'
                  )
                }
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200 transition"
              >
                🛑 Passenger Route Dispute
              </button>
              <button
                type="button"
                onClick={() =>
                  setDescription(
                    'Platform algorithm suddenly throttled and suspended account without prior notice or show-cause inquiry following an unverified low rating from a single customer.'
                  )
                }
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200 transition"
              >
                🚫 Arbitrary Account Ban
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Escalation Tier Selector Tabs */}
      <div role="tablist" aria-label="Dispute Escalation Tiers" className="flex flex-wrap items-center gap-2">
        <button
          role="tab"
          id="tab-tier1"
          aria-selected={activeTier === 'tier1'}
          aria-controls="dispute-content-panel"
          onClick={() => setActiveTier('tier1')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border focus:outline-none focus:ring-2 focus:ring-[#0d9488] ${
            activeTier === 'tier1'
              ? 'bg-[#0d3830] text-white border-[#0d3830] shadow-md'
              : 'bg-white text-[#4a5f59] border-[#e2ece9] hover:bg-[#f4fbf8]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#5eead4]" aria-hidden="true" />
          <span>Tier 1: In-App Support Chat</span>
        </button>

        <button
          role="tab"
          id="tab-tier2"
          aria-selected={activeTier === 'tier2'}
          aria-controls="dispute-content-panel"
          onClick={() => setActiveTier('tier2')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border focus:outline-none focus:ring-2 focus:ring-[#0d9488] ${
            activeTier === 'tier2'
              ? 'bg-[#0d3830] text-white border-[#0d3830] shadow-md'
              : 'bg-white text-[#4a5f59] border-[#e2ece9] hover:bg-[#f4fbf8]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#99f6e4]" aria-hidden="true" />
          <span>Tier 2: Operations Management Email</span>
        </button>

        <button
          role="tab"
          id="tab-tier3"
          aria-selected={activeTier === 'tier3'}
          aria-controls="dispute-content-panel"
          onClick={() => setActiveTier('tier3')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border focus:outline-none focus:ring-2 focus:ring-[#0d9488] ${
            activeTier === 'tier3'
              ? 'bg-[#0d3830] text-white border-[#0d3830] shadow-md'
              : 'bg-white text-[#4a5f59] border-[#e2ece9] hover:bg-[#f4fbf8]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-[#2dd4bf]" aria-hidden="true" />
          <span>Tier 3: Labor Board Legal Petition</span>
        </button>
      </div>

      {/* Generated Letter Display Container */}
      <div
        role="tabpanel"
        id="dispute-content-panel"
        aria-labelledby={`tab-${activeTier}`}
        className="bg-white rounded-2xl border border-[#e2ece9] shadow-sm overflow-hidden"
      >
        
        {/* Action Header on Box */}
        <div className="bg-[#f4fbf8] px-5 py-3 border-b border-[#e2ece9] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#102a24]">
              {activeTier === 'tier1'
                ? 'Quick Message for In-App Live Support Chat'
                : activeTier === 'tier2'
                ? 'Formal Escalation Email to Operations & Grievance Cell'
                : 'Statutory Petition to District Labor Commissioner'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={speakActiveText}
              aria-label="Listen aloud to the drafted petition"
              className="text-xs bg-white hover:bg-[#f4fbf8] text-[#102a24] px-3 py-1.5 rounded-lg border border-[#d1deda] font-semibold flex items-center gap-1.5 transition focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              title="Listen Aloud"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#0d9488]" aria-hidden="true" />
              <span>Listen</span>
            </button>

            <button
              onClick={() => {
                const text = activeTier === 'tier1'
                  ? draftResult?.inAppSupportMessage
                  : activeTier === 'tier2'
                  ? draftResult?.officialEscalationEmail?.body
                  : draftResult?.laborCommissionerPetition?.body;
                handleCopyText(text || '');
              }}
              aria-label="Copy dispute petition to clipboard"
              className="text-xs bg-white hover:bg-[#f4fbf8] text-[#102a24] px-3 py-1.5 rounded-lg border border-[#d1deda] font-semibold flex items-center gap-1.5 transition focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5 text-[#718882]" aria-hidden="true" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={() => {
                const text = activeTier === 'tier1'
                  ? draftResult?.inAppSupportMessage
                  : draftResult?.officialEscalationEmail?.body;
                handleWhatsAppShare(text || '');
              }}
              aria-label="Share dispute draft via WhatsApp"
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              aria-label="Download dispute petition as PDF document"
              className="text-xs bg-[#0d3830] hover:bg-[#0a2e27] text-white px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            >
              <Download className="w-3.5 h-3.5 text-[#5eead4]" aria-hidden="true" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {draftResult ? (
            <div className="space-y-4">
              
              {/* Subject line for Tier 2 */}
              {activeTier === 'tier2' && draftResult.officialEscalationEmail?.subject && (
                <div className="bg-[#f4fbf8] p-3 rounded-xl border border-[#e2ece9] text-xs font-mono">
                  <span className="font-bold text-[#5a736d]">Subject: </span>
                  <span className="text-[#102a24] font-bold">{draftResult.officialEscalationEmail.subject}</span>
                </div>
              )}

              {/* Legal Acts Cited for Tier 3 */}
              {activeTier === 'tier3' && draftResult.laborCommissionerPetition?.relevantLegalActs && (
                <div className="bg-[#fef3c7] p-3 rounded-xl border border-[#fde68a] text-xs text-[#92400e] space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-[#92400e]">
                    <ShieldCheck className="w-4 h-4 text-[#d97706]" />
                    <span>Statutory Legal Acts Invoked:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                    {draftResult.laborCommissionerPetition.relevantLegalActs.map((act: string, idx: number) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Main Letter Body */}
              <div className="bg-[#f8faf9] p-5 rounded-xl border border-[#e2ece9] font-sans text-xs sm:text-sm text-[#102a24] whitespace-pre-wrap leading-relaxed shadow-inner">
                {activeTier === 'tier1'
                  ? draftResult.inAppSupportMessage
                  : activeTier === 'tier2'
                  ? draftResult.officialEscalationEmail?.body
                  : draftResult.laborCommissionerPetition?.body}
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-[#718882] text-sm">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-[#0d9488] animate-spin" />
              Drafting official dispute package with citations...
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
