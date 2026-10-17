'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

interface EarningsAuditTabProps {
  language: Language;
  persona: Persona;
  onNavigateToDispute: (incidentData: {
    platform: string;
    description: string;
    amount: string;
    orderId: string;
  }) => void;
}

export const EarningsAuditTab: React.FC<EarningsAuditTabProps> = ({
  language,
  persona,
  onNavigateToDispute,
}) => {
  const [currentRecord, setCurrentRecord] = useState<EarningsRecord>(sampleEarningsPresets[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customText, setCustomText] = useState('');
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);

  const handleSelectPreset = (record: EarningsRecord) => {
    setCurrentRecord(record);
    setUploadedImageName(null);
  };

  const handleSimulateCustomAudit = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textInput: customText || `Analyzing ${persona} earnings shift`,
          persona,
        }),
      });
      const data = await res.json();
      setCurrentRecord({
        ...currentRecord,
        id: 'custom-' + Date.now(),
        source: 'User Uploaded Slip / Text Input',
        grossPay: data.grossPay || 1400,
        ordersOrTrips: data.ordersOrTrips || 12,
        activeHours: data.activeHours || 10,
        tips: data.tips || 50,
        surge: data.surge || 100,
        deductions: {
          fuelEstimate: data.deductions?.fuelEstimate || 300,
          platformCommission: data.deductions?.platformCommission || 0,
          penalty: data.deductions?.penalty || 350,
          penaltyReason: data.deductions?.penaltyReason || 'Customer Delay Dispute',
        },
        netPay: data.netPay || 750,
        realHourlyWage: data.realHourlyWage || 75,
        statutoryMinHourlyWage: 95,
        discrepancyAlert: data.discrepancyAlert || 'Unfair penalty flagged during peak weather.',
        explanationHindi: data.explanationHindi || 'आपकी कटी हुई पेनल्टी वापस पाने योग्य है।',
        explanationEnglish: data.explanationEnglish || 'Penalty flagged for appeal.',
      });
    } catch (e) {
      console.error(e);
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

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Presets */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <span>Earnings & Unfair Deduction Auditor</span>
              <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded-full">
                Multimodal OCR
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload delivery app screenshot, weekly summary, or photo of daily wage slip to discover your true net take-home and flag illegal deductions.
            </p>
          </div>

          {/* Preset Buttons for Quick Hackathon Demo */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Demo Slips:</span>
            {sampleEarningsPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition border ${
                  currentRecord.id === preset.id
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {preset.workerPersona === 'delivery' ? '🛵 Swiggy Rain Fine' : preset.workerPersona === 'driver' ? '🚗 Uber Clawback' : '🔨 Labor Wage Cut'}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Drop Zone & Custom Input */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* File Upload Button */}
          <label className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-xl p-3 flex items-center justify-center gap-3 cursor-pointer bg-slate-50 hover:bg-orange-50/40 transition group">
            <Upload className="w-5 h-5 text-slate-400 group-hover:text-orange-600" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-700 group-hover:text-orange-700">
                {uploadedImageName ? `Uploaded: ${uploadedImageName}` : 'Upload App Screenshot or Daily Slip'}
              </div>
              <div className="text-[11px] text-slate-400">Supports PNG, JPG, or Camera Photos</div>
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
              className="flex-1 bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSimulateCustomAudit}
              disabled={isAnalyzing}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAnalyzing ? 'Auditing...' : 'Audit'}</span>
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
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-lg border border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                  The True Bottomline
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5 flex items-baseline gap-2">
                  ₹{currentRecord.netPay}
                  <span className="text-sm font-normal text-slate-300">
                    Net Take-Home (Real Pocket Cash)
                  </span>
                </h3>
              </div>

              {/* Hourly Wage Badge */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-right sm:text-right">
                <div className="text-[11px] text-slate-400">Your Real Hourly Wage</div>
                <div className={`text-xl font-black ${isBelowMinWage ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ₹{currentRecord.realHourlyWage.toFixed(1)} / hr
                </div>
                <div className="text-[10px] text-slate-400">
                  Govt Min Wage: ₹{currentRecord.statutoryMinHourlyWage} / hr
                </div>
              </div>
            </div>

            {/* Warning if below minimum wage */}
            {isBelowMinWage && (
              <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center gap-2 text-xs text-rose-300 font-medium">
                <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Alert: Due to deductions, your effective earnings are <strong>{Math.round(((currentRecord.statutoryMinHourlyWage - currentRecord.realHourlyWage) / currentRecord.statutoryMinHourlyWage) * 100)}% below statutory minimum wage</strong>.
                </span>
              </div>
            )}
          </div>

          {/* Plain Language Vernacular Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <span>Vernacular Plain Language Explanation</span>
              </h4>
              <button
                onClick={speakExplanation}
                className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 border border-orange-200 transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen in Voice</span>
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {language === 'en' ? currentRecord.explanationEnglish : currentRecord.explanationHindi}
            </p>
          </div>

        </div>

        {/* Right Col: Discrepancy & 1-Click Action to Dispute Drafter */}
        <div className="space-y-4">
          
          <div className="bg-gradient-to-b from-rose-50 to-orange-50 rounded-2xl p-5 border-2 border-rose-200 shadow-sm flex flex-col justify-between">
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
                className="w-full bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition group"
              >
                <span>Draft Refund Dispute Notice</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] text-center text-slate-500 mt-2">
                1-click transfers evidence to official grievance petition
              </p>
            </div>

          </div>

          {/* Quick Tip Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-orange-500" />
              <span>Did You Know?</span>
            </div>
            <p className="leading-relaxed">
              Under the Central Motor Vehicles Aggregator Guidelines and State Gig Worker Acts, platforms cannot levy cancellation or delay fines if caused by verified force majeure weather or app GPS errors.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
