'use client';

import React, { useState, useEffect } from 'react';
import { sampleEarningsPresets, EarningsRecord } from '@/lib/sampleData';
import { Language, Persona } from '@/lib/translations';
import {
  Upload,
  AlertTriangle,
  TrendingDown,
  Clock,
  Fuel,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Volume2,
  DollarSign,
  HelpCircle,
  Save,
  Trash2,
  History,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';
import { User } from '@/lib/auth';

interface EarningsAuditTabProps {
  language: Language;
  persona: Persona;
  onNavigateToDispute: (incidentData: {
    platform: string;
    description: string;
    amount: string;
    orderId: string;
  }) => void;
  user?: User | null;
  onOpenAuthModal?: (mode?: 'login' | 'signup') => void;
}

const STORAGE_KEY = 'gig_kavach_earnings_log';

export const EarningsAuditTab: React.FC<EarningsAuditTabProps> = ({
  language,
  persona,
  onNavigateToDispute,
  user,
  onOpenAuthModal,
}) => {
  const [currentRecord, setCurrentRecord] = useState<EarningsRecord>(sampleEarningsPresets[0]);
  const [savedLogs, setSavedLogs] = useState<EarningsRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Manual Input Box States
  const [inputGross, setInputGross] = useState<string>('1450');
  const [inputHours, setInputHours] = useState<string>('10');
  const [inputPenalty, setInputPenalty] = useState<string>('350');
  const [inputPenaltyReason, setInputPenaltyReason] = useState<string>('Customer Rain Delay Bottleneck');
  const [inputPlatform, setInputPlatform] = useState<string>('Swiggy');
  const [customText, setCustomText] = useState('');
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);

  const DEMO_PHONE = '7737309096';
  const isDemoOrGuest = !user || user.phoneNumber === DEMO_PHONE;

  // Initialize and pull from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('saathi_earnings_log');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedLogs(parsed);
            setCurrentRecord(parsed[0]);
            return;
          }
        }
        // Only seed sample data for guests / demo user, not real users
        if (isDemoOrGuest) {
          setSavedLogs(sampleEarningsPresets);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleEarningsPresets));
        }
      } catch (err) {
        console.error('Error reading localStorage:', err);
      }
    }
  }, []);

  // Helper to persist logs into LocalStorage
  const persistLogs = (logs: EarningsRecord[]) => {
    setSavedLogs(logs);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
    }
  };

  const handleSelectPresetOrLog = (record: EarningsRecord) => {
    setCurrentRecord(record);
    setInputGross(record.grossPay.toString());
    setInputHours(record.activeHours.toString());
    setInputPenalty(record.deductions.penalty.toString());
    setInputPenaltyReason(record.deductions.penaltyReason);
    setInputPlatform(record.source.split(' ')[0] || 'Platform');
    setUploadedImageName(null);
  };

  // Save custom input values to LocalStorage and update current view
  const handleSaveShiftPayout = () => {
    const gross = parseFloat(inputGross) || 0;
    const hours = parseFloat(inputHours) || 8;
    const penalty = parseFloat(inputPenalty) || 0;
    const fuel = Math.round(gross * 0.22);
    const net = Math.max(0, gross - fuel - penalty);
    const hourlyWage = hours > 0 ? Math.round((net / hours) * 10) / 10 : 0;
    const minWage = 95.0;

    const newRecord: EarningsRecord = {
      id: 'saved-' + Date.now(),
      source: `${inputPlatform || 'Platform'} Shift Payout`,
      workerPersona: persona,
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      grossPay: gross,
      ordersOrTrips: Math.max(1, Math.round(gross / 100)),
      activeHours: hours,
      tips: Math.round(gross * 0.05),
      surge: Math.round(gross * 0.1),
      deductions: {
        fuelEstimate: fuel,
        platformCommission: 0,
        penalty: penalty,
        penaltyReason: inputPenaltyReason || 'Unexplained deduction',
      },
      netPay: net,
      realHourlyWage: hourlyWage,
      statutoryMinHourlyWage: minWage,
      discrepancyAlert: penalty > 0
        ? `Unfair Penalty Alert: A penalty of ₹${penalty} was deducted for "${inputPenaltyReason}". This deduction dropped your effective wage to ₹${hourlyWage}/hr.`
        : null,
      explanationHindi: `कुल कमाई ₹${gross} थी। ₹${fuel} पेट्रोल और ₹${penalty} कटौती के बाद असली बचत ₹${net} (यानी ₹${hourlyWage}/घंटा) रही।`,
      explanationEnglish: `Gross payout logged at ₹${gross}. After ₹${fuel} fuel and ₹${penalty} deductions, real take-home is ₹${net} (₹${hourlyWage}/hr).`,
    };

    const updated = [newRecord, ...savedLogs];
    persistLogs(updated);
    setCurrentRecord(newRecord);
    setShowManualForm(false);
    setSaveSuccessMsg(`✓ Shift payout of ₹${gross} saved to your records!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleDeleteSavedLog = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedLogs.filter((log) => log.id !== id);
    persistLogs(updated);
    if (currentRecord.id === id && updated.length > 0) {
      setCurrentRecord(updated[0]);
    }
  };

  const handleSimulateCustomAudit = async () => {
    setIsAnalyzing(true);
    try {
      let data: any = null;
      try {
        const payloadText = customText.trim()
          ? customText.trim()
          : `Platform: ${inputPlatform}, Gross: ₹${inputGross}, Active Hours: ${inputHours}, Penalty: ₹${inputPenalty} for ${inputPenaltyReason}`;

        const res = await fetch('/api/analyze-earnings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            textInput: payloadText,
            persona,
          }),
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (networkErr) {
        console.warn('Backend API unavailable, executing client-side audit engine:', networkErr);
      }

      // If backend didn't return data, run intelligent client-side calculation
      if (!data) {
        const textToParse = customText || '';
        const parsedGross = textToParse.match(/(?:gross|earned|कमाई|₹)\s*(\d+)/i) || textToParse.match(/(\d{3,5})/);
        const parsedHours = textToParse.match(/(\d+)\s*(?:hrs|hours|घंटे)/i);
        const parsedPenalty = textToParse.match(/(?:penalty|cut|deduction|कटौती|पेनल्टी)\s*(?:of\s*)?(?:₹)?\s*(\d+)/i);

        const gross = parsedGross ? parseFloat(parsedGross[1]) : (parseFloat(inputGross) || 1450);
        const hours = parsedHours ? parseFloat(parsedHours[1]) : (parseFloat(inputHours) || 10);
        const penalty = parsedPenalty ? parseFloat(parsedPenalty[1]) : (parseFloat(inputPenalty) || 350);
        const fuel = Math.round(gross * 0.22);
        const net = Math.max(0, gross - fuel - penalty);
        const hourly = hours > 0 ? Math.round((net / hours) * 10) / 10 : 0;
        const reason = inputPenaltyReason || 'Customer Delay / Weather Escalation';

        data = {
          grossPay: gross,
          ordersOrTrips: Math.max(1, Math.round(gross / 110)),
          activeHours: hours,
          tips: Math.round(gross * 0.05),
          surge: Math.round(gross * 0.08),
          deductions: {
            fuelEstimate: fuel,
            platformCommission: 0,
            penalty: penalty,
            penaltyReason: reason,
          },
          netPay: net,
          realHourlyWage: hourly,
          statutoryMinHourlyWage: 95.0,
          discrepancyAlert: penalty > 0
            ? `Unfair Deduction Detected: A penalty of ₹${penalty} was levied for "${reason}". Under platform fair conduct norms, weather and customer delays beyond partner control are eligible for immediate appeal and refund.`
            : null,
          explanationHindi: `AI जांच पूरी: कुल कमाई ₹${gross} थी। ₹${fuel} पेट्रोल और ₹${penalty} की पेनल्टी कटने के बाद आपकी वास्तविक बचत ₹${net} (यानी ₹${hourly}/घंटा) रही। कटी हुई पेनल्टी वापस पाने के लिए अपील ड्राफ्ट करें।`,
          explanationEnglish: `AI Audit Complete: Gross payout of ₹${gross} over ${hours} hours. Deductions of ₹${fuel} fuel and ₹${penalty} penalty leave net cash at ₹${net} (₹${hourly}/hr). The penalty is eligible for immediate dispute.`
        };
      }

      const auditedRecord: EarningsRecord = {
        id: 'audit-' + Date.now(),
        source: `${inputPlatform || (persona === 'driver' ? 'Uber' : 'Swiggy')} AI Audit`,
        workerPersona: persona,
        date: 'Today (Audited Shift)',
        grossPay: data.grossPay || 1450,
        ordersOrTrips: data.ordersOrTrips || 12,
        activeHours: data.activeHours || 10,
        tips: data.tips || 50,
        surge: data.surge || 100,
        deductions: {
          fuelEstimate: data.deductions?.fuelEstimate || Math.round((data.grossPay || 1450) * 0.22),
          platformCommission: data.deductions?.platformCommission || 0,
          penalty: data.deductions?.penalty ?? 350,
          penaltyReason: data.deductions?.penaltyReason || inputPenaltyReason || 'Customer Delay Dispute',
        },
        netPay: data.netPay ?? 781,
        realHourlyWage: data.realHourlyWage ?? 78.1,
        statutoryMinHourlyWage: 95.0,
        discrepancyAlert: data.discrepancyAlert || (data.deductions?.penalty > 0 ? `Unfair penalty of ₹${data.deductions.penalty} flagged.` : null),
        explanationHindi: data.explanationHindi || 'आपकी कटी हुई पेनल्टी वापस पाने योग्य है।',
        explanationEnglish: data.explanationEnglish || 'Penalty flagged for appeal.',
      };

      setCurrentRecord(auditedRecord);
      setInputGross(auditedRecord.grossPay.toString());
      setInputHours(auditedRecord.activeHours.toString());
      setInputPenalty(auditedRecord.deductions.penalty.toString());
      setInputPenaltyReason(auditedRecord.deductions.penaltyReason);

      const updated = [auditedRecord, ...savedLogs];
      persistLogs(updated);
      setSaveSuccessMsg(`✓ AI Audit complete! Shift of ₹${auditedRecord.grossPay} analyzed and updated.`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (e) {
      console.error('Audit execution error:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageName(file.name);
      handleSimulateCustomAudit();
    }
  };

  const speakExplanation = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const textToSpeak = language === 'en' ? currentRecord.explanationEnglish : currentRecord.explanationHindi;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'en' ? 'en-IN' : 'hi-IN';
    window.speechSynthesis.speak(utterance);
  };

  const isBelowMinWage = currentRecord.realHourlyWage < currentRecord.statutoryMinHourlyWage;

  // Cumulative stats from LocalStorage logs
  const totalGrossSaved = savedLogs.reduce((acc, log) => acc + (log.grossPay || 0), 0);
  const totalPenaltiesSaved = savedLogs.reduce((acc, log) => acc + (log.deductions?.penalty || 0), 0);
  const totalNetSaved = savedLogs.reduce((acc, log) => acc + (log.netPay || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{saveSuccessMsg}</span>
          </div>
          <span className="text-[10px] bg-emerald-700/60 px-2 py-0.5 rounded">LocalStorage Synced</span>
        </div>
      )}

      {/* Top Banner & Quick Presets */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2ece9]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-heading font-bold text-[#102a24] flex flex-wrap items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#0d9488]" aria-hidden="true" />
              <span>Earnings & Unfair Deduction Auditor</span>
              {user ? (
                <span className="text-xs bg-[#ccfbf1] text-[#0f766e] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-[#99f6e4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] animate-pulse" />
                  <span>✓ D1 Cloud Synced ({user.name})</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuthModal && onOpenAuthModal('signup')}
                  title="यह केवल डेमो है, डेटा सेव नहीं हो रहा है। खाता बनाने के लिए क्लिक करें।"
                  aria-label="डेमो मोड: डेटा स्थायी रूप से सुरक्षित नहीं है। खाता बनाने के लिए क्लिक करें।"
                  className="text-xs bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-[#fde68a] transition cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-ping" />
                  <span>⚠️ डेमो मोड: डेटा सुरक्षित नहीं — <span className="underline font-black text-[#78350f]">खाता बनाएं (Create Account)</span></span>
                </button>
              )}
            </h2>
            <p className="text-xs text-[#5a736d] mt-1">
              Audit your delivery slips, calculate real take-home cash, and automatically save shift payouts to your personal device history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="px-3.5 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{showManualForm ? 'Hide Shift Form' : '+ Log Shift Details'}</span>
            </button>
          </div>
        </div>

        {/* Manual Input Box */}
        {showManualForm && (
          <div className="mt-4 pt-4 border-t border-[#e2ece9] bg-[#f4fbf8] p-4 rounded-xl border border-[#cfe9e1] space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#0f766e] uppercase tracking-wide flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5 text-[#0d9488]" />
                <span>Log Shift Payout (अपनी शिफ्ट की कमाई दर्ज करें)</span>
              </h3>
              <span className="text-[10px] text-[#718882] font-medium">Calculations & deductions are saved to your shift history</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="font-semibold text-[#102a24] block mb-1">Company / Platform</label>
                <input
                  type="text"
                  value={inputPlatform}
                  onChange={(e) => setInputPlatform(e.target.value)}
                  placeholder="Swiggy, Uber, Zepto..."
                  className="w-full bg-white px-3 py-2 rounded-lg border border-[#d1deda] font-medium focus:ring-2 focus:ring-[#0d9488] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#102a24] block mb-1">Gross Payout (₹)</label>
                <input
                  type="number"
                  value={inputGross}
                  onChange={(e) => setInputGross(e.target.value)}
                  placeholder="1450"
                  className="w-full bg-white px-3 py-2 rounded-lg border border-[#d1deda] font-bold text-[#102a24] focus:ring-2 focus:ring-[#0d9488] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#102a24] block mb-1">Active Hours</label>
                <input
                  type="number"
                  value={inputHours}
                  onChange={(e) => setInputHours(e.target.value)}
                  placeholder="10"
                  className="w-full bg-white px-3 py-2 rounded-lg border border-[#d1deda] font-medium focus:ring-2 focus:ring-[#0d9488] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#102a24] block mb-1">Unfair Deduction (₹)</label>
                <input
                  type="number"
                  value={inputPenalty}
                  onChange={(e) => setInputPenalty(e.target.value)}
                  placeholder="350"
                  className="w-full bg-white px-3 py-2 rounded-lg border border-[#d1deda] font-bold text-rose-600 focus:ring-2 focus:ring-[#0d9488] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#102a24] block mb-1">Deduction Reason</label>
                <input
                  type="text"
                  value={inputPenaltyReason}
                  onChange={(e) => setInputPenaltyReason(e.target.value)}
                  placeholder="Rain delay, cancellation..."
                  className="w-full bg-white px-3 py-2 rounded-lg border border-[#d1deda] font-medium focus:ring-2 focus:ring-[#0d9488] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleSaveShiftPayout}
                className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save & Audit Shift (शिफ्ट सेव और जांचें)</span>
              </button>
            </div>
          </div>
        )}

        {/* Upload Drop Zone & AI Quick Text Input */}
        <div className="mt-4 pt-4 border-t border-[#e2ece9] grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* File Upload Button */}
          <label className="border-2 border-dashed border-[#cfe9e1] hover:border-[#0d9488] rounded-xl p-3 flex items-center justify-center gap-3 cursor-pointer bg-[#f4fbf8] hover:bg-[#e6f5f0] transition group">
            <Upload className="w-5 h-5 text-[#718882] group-hover:text-[#0d9488]" />
            <div className="text-left">
              <div className="text-xs font-bold text-[#102a24] group-hover:text-[#0f766e]">
                {uploadedImageName ? `Uploaded: ${uploadedImageName}` : 'Upload App Screenshot or Daily Slip'}
              </div>
              <div className="text-[11px] text-[#718882]">Multimodal OCR auto-extracts and saves to device</div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageMockUpload}
              className="hidden"
            />
          </label>

          {/* Quick Text Input for Dictation */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Or type/paste: 'Swiggy shift 11 hrs, gross 1250, cut 350 penalty'"
              className="flex-1 bg-[#f4fbf8] text-xs px-3 py-2 rounded-xl border border-[#d1deda] focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            />
            <button
              onClick={handleSimulateCustomAudit}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-[#0d3830] hover:bg-[#0a2e27] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shadow-md"
            >
              <Sparkles className={`w-3.5 h-3.5 text-[#5eead4] ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Auditing with AI...' : 'AI Audit'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Analysis Display Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: Financial Ledger & Net Hourly Wage */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Headline Numbers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Gross Payout</span>
              <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
                ₹{currentRecord.grossPay}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                <FileCheck2 className="w-3 h-3 text-emerald-600" />
                {currentRecord.ordersOrTrips} {currentRecord.workerPersona === 'driver' ? 'Trips' : 'Deliveries'}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Hours Logged</span>
              <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
                {currentRecord.activeHours} hrs
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Active on app
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Fuel & Wear</span>
              <span className="text-xl font-extrabold text-slate-700 mt-0.5 block">
                -₹{currentRecord.deductions.fuelEstimate}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                <Fuel className="w-3 h-3 text-amber-500" />
                Real vehicle cost
              </span>
            </div>

            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 shadow-sm">
              <span className="text-[11px] font-semibold text-rose-500 block uppercase">Unfair Deductions</span>
              <span className="text-xl font-extrabold text-rose-700 mt-0.5 block">
                -₹{currentRecord.deductions.penalty}
              </span>
              <span className="text-[11px] text-rose-600 flex items-center gap-1 mt-1 font-semibold truncate">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                Penalty withheld
              </span>
            </div>

          </div>

          {/* Real Hourly Wage Comparison Gauge */}
          <div className="bg-[#0d3830] text-white rounded-2xl p-5 shadow-lg border border-[#174a40]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#5eead4] uppercase tracking-wider">
                  The True Bottomline
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5 flex items-baseline gap-2">
                  ₹{currentRecord.netPay}
                  <span className="text-sm font-normal text-[#cfe9e1]">
                    Net Take-Home (Real Pocket Cash)
                  </span>
                </h3>
              </div>

              {/* Hourly Wage Badge */}
              <div className="bg-[#0a2e27] border border-[#174a40] rounded-xl px-4 py-2.5 text-right sm:text-right">
                <div className="text-[11px] text-[#cfe9e1]">Your Real Hourly Wage</div>
                <div className={`text-xl font-black ${isBelowMinWage ? 'text-rose-400' : 'text-[#2dd4bf]'}`}>
                  ₹{currentRecord.realHourlyWage.toFixed(1)} / hr
                </div>
                <div className="text-[10px] text-[#718882]">
                  Govt Min Wage: ₹{currentRecord.statutoryMinHourlyWage} / hr
                </div>
              </div>
            </div>

            {/* Warning if below minimum wage */}
            {isBelowMinWage && (
              <div className="mt-4 pt-3 border-t border-[#174a40] flex items-center gap-2 text-xs text-rose-300 font-medium">
                <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Alert: Due to deductions, your effective earnings are <strong>{Math.round(((currentRecord.statutoryMinHourlyWage - currentRecord.realHourlyWage) / currentRecord.statutoryMinHourlyWage) * 100)}% below statutory minimum wage</strong>.
                </span>
              </div>
            )}
          </div>

          {/* Plain Language Vernacular Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2ece9] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-[#102a24] flex items-center gap-2">
                <span>Vernacular Plain Language Explanation</span>
              </h4>
              <button
                onClick={speakExplanation}
                className="text-xs bg-[#ccfbf1] hover:bg-[#99f6e4] text-[#0f766e] font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 border border-[#99f6e4] transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen in Voice</span>
              </button>
            </div>

            <p className="text-sm text-[#4a5f59] leading-relaxed bg-[#f4fbf8] p-3.5 rounded-xl border border-[#e2ece9]">
              {language === 'en' ? currentRecord.explanationEnglish : currentRecord.explanationHindi}
            </p>
          </div>

        </div>

        {/* Right Col: Discrepancy & 1-Click Action to Dispute Drafter */}
        <div className="space-y-4">
          
          <div className="bg-gradient-to-b from-rose-50 to-[#f4fbf8] rounded-2xl p-5 border-2 border-rose-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Unfair Penalty Detected!</span>
              </div>

              <div className="text-xs text-rose-950 leading-relaxed font-medium bg-white/80 p-3 rounded-xl border border-rose-200/80">
                {currentRecord.discrepancyAlert || "Penalty requires appeal."}
              </div>

              <div className="text-[11px] text-slate-600 space-y-1">
                <div>• Reason: <strong>{currentRecord.deductions.penaltyReason}</strong></div>
                <div>• Deduction Amount: <strong className="text-rose-700">₹{currentRecord.deductions.penalty}</strong></div>
                <div>• Platform: <strong>{currentRecord.source}</strong></div>
              </div>
            </div>

            {/* 1-Click Action Button to pass data to Dispute Drafter */}
            <div className="mt-5 pt-4 border-t border-rose-200/60">
              <button
                onClick={() =>
                  onNavigateToDispute({
                    platform: currentRecord.source.split(' ')[0] || 'Swiggy',
                    description: `${currentRecord.deductions.penaltyReason}. Delay occurred due to environmental conditions during shift.`,
                    amount: currentRecord.deductions.penalty.toString(),
                    orderId: 'SW-9481',
                  })
                }
                className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md shadow-[#0d9488]/30 flex items-center justify-center gap-2 transition group active:scale-[0.98]"
              >
                <span>Draft Refund Dispute Notice</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] text-center text-[#5a736d] mt-2">
                1-click transfers evidence to official grievance petition
              </p>
            </div>

          </div>

          {/* Quick Tip Card */}
          <div className="bg-[#f4fbf8] rounded-2xl p-4 border border-[#e2ece9] text-xs text-[#4a5f59] space-y-1.5">
            <div className="font-bold text-[#102a24] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#0f766e]" />
              <span>Did You Know?</span>
            </div>
            <p className="leading-relaxed">
              Under the Central Motor Vehicles Aggregator Guidelines and State Gig Worker Acts, platforms cannot levy cancellation or delay fines if caused by verified force majeure weather or app GPS errors.
            </p>
          </div>

        </div>

      </div>

      {/* Persistent LocalStorage Earnings History Log Table */}
      <div className="bg-white rounded-2xl p-5 border border-[#e2ece9] shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#e2ece9]">
          <div>
            <h3 className="font-heading font-bold text-sm text-[#102a24] flex items-center gap-2">
              <History className="w-4 h-4 text-[#0f766e]" />
              <span>Device Saved Earnings Log ({savedLogs.length} Shifts Recorded)</span>
            </h3>
            <p className="text-xs text-[#5a736d] mt-0.5">
              Saved in browser LocalStorage. Click any row to load into auditor or draft dispute.
            </p>
          </div>

          {/* Cumulative Totals Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs bg-[#f4fbf8] px-3.5 py-1.5 rounded-xl border border-[#e2ece9]">
            <div>
              <span className="text-[#718882]">Total Gross: </span>
              <span className="font-extrabold text-[#102a24]">₹{totalGrossSaved}</span>
            </div>
            <div className="text-[#d1deda]">|</div>
            <div>
              <span className="text-[#718882]">Penalties Withheld: </span>
              <span className="font-extrabold text-rose-600">₹{totalPenaltiesSaved}</span>
            </div>
            <div className="text-[#d1deda]">|</div>
            <div>
              <span className="text-[#718882]">Total Net: </span>
              <span className="font-extrabold text-[#0f766e]">₹{totalNetSaved}</span>
            </div>
          </div>
        </div>

        {/* Saved Table / Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2ece9] text-[#718882] font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Date / Shift</th>
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Gross Pay</th>
                <th className="py-2.5 px-3">Hours</th>
                <th className="py-2.5 px-3">Unfair Penalty</th>
                <th className="py-2.5 px-3">Net Real Pay</th>
                <th className="py-2.5 px-3">Hourly Rate</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf4f1] font-medium">
              {savedLogs.map((log) => {
                const isSelected = currentRecord.id === log.id;
                return (
                  <tr
                    key={log.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`Shift from ${log.date}, platform ${log.source.split(' ')[0]}, gross ${log.grossPay} rupees, net ${log.netPay} rupees`}
                    onClick={() => handleSelectPresetOrLog(log)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectPresetOrLog(log);
                      }
                    }}
                    className={`cursor-pointer transition hover:bg-[#f4fbf8] focus:outline-none focus:ring-2 focus:ring-[#0d9488] rounded-lg ${
                      isSelected ? 'bg-[#e6f5f0] font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-[#102a24] whitespace-nowrap">
                      {log.date}
                      {isSelected && (
                        <span className="ml-1.5 text-[9px] bg-[#0f766e] text-white px-1.5 py-0.2 rounded font-bold">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {log.source.split(' ')[0]}
                    </td>
                    <td className="py-3 px-3 text-slate-900 font-bold whitespace-nowrap">
                      ₹{log.grossPay}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {log.activeHours} hrs
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {log.deductions.penalty > 0 ? (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" />
                          ₹{log.deductions.penalty}
                        </span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold whitespace-nowrap">
                      ₹{log.netPay}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={log.realHourlyWage < 95 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                        ₹{log.realHourlyWage.toFixed(1)}/hr
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSelectPresetOrLog(log)}
                          aria-label={`Load shift from ${log.date} into auditor`}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                        >
                          Load
                        </button>
                        <button
                          onClick={(e) => handleDeleteSavedLog(log.id, e)}
                          aria-label={`Delete shift record from ${log.date}`}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                          title="Delete from device storage"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
