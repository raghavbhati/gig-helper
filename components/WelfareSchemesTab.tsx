'use client';

import React, { useState } from 'react';
import { sampleWelfareSchemes, WelfareScheme } from '@/lib/sampleData';
import { Language, Persona } from '@/lib/translations';
import {
  Building2,
  ShieldCheck,
  HeartHandshake,
  ExternalLink,
  CheckCircle2,
  FileText,
  Volume2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WelfareSchemesTabProps {
  language: Language;
  persona: Persona;
}

export const WelfareSchemesTab: React.FC<WelfareSchemesTabProps> = ({
  language,
  persona,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string>('e-shram');

  // Quick Eligibility Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAge, setQuizAge] = useState('28');
  const [quizIncomeTax, setQuizIncomeTax] = useState('no');
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const handleRunQuiz = () => {
    const age = parseInt(quizAge, 10);
    if (age >= 16 && age <= 59 && quizIncomeTax === 'no') {
      setQuizResult(
        language === 'en'
          ? "🎉 Congratulations! You are eligible for 100% of the welfare schemes listed below (e-Shram, PM-JAY, State Gig Board, and PM SVANidhi)."
          : "🎉 बधाई! आप नीचे दी गई सभी कल्याणकारी योजनाओं (e-Shram, PM-JAY, राज्य गिग बोर्ड और पीएम स्वनिधि) के लिए 100% पात्र हैं।"
      );
    } else {
      setQuizResult(
        language === 'en'
          ? "You are eligible for State Gig Worker Welfare Fund and Ayushman Bharat PM-JAY."
          : "आप राज्य गिग वर्कर बोर्ड और आयुष्मान भारत योजना के लिए पात्र हैं।"
      );
    }
  };

  const filteredSchemes = sampleWelfareSchemes.filter((scheme) => {
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesPersona = scheme.eligiblePersonas.includes(persona);
    return matchesCategory && matchesPersona;
  });

  const speakScheme = (scheme: WelfareScheme) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = language === 'en'
      ? `${scheme.title}. Benefits: ${scheme.benefitAmount}. Documents required: ${scheme.documentsRequired.join(', ')}.`
      : `${scheme.titleHindi}. लाभ: ${scheme.benefitAmountHindi}. ज़रूरी कागज़ात: ${scheme.documentsRequired.join(', ')}.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-IN' : 'hi-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Eligibility Checker */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              <span>Government Rights & Welfare Schemes Navigator</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                Zero-Cost Social Security
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Over 90% of informal gig workers miss out on ₹2 Lakh accidental covers and state funds due to lack of awareness. Claim what is rightfully yours.
            </p>
          </div>

          <button
            onClick={() => setShowQuiz(!showQuiz)}
            aria-expanded={showQuiz}
            aria-controls="eligibility-matcher-panel"
            aria-label={showQuiz ? 'Hide Eligibility Matcher' : 'Check My Eligibility in 30 Sec'}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <Sparkles className="w-4 h-4 text-amber-200" aria-hidden="true" />
            <span>{showQuiz ? 'Hide Eligibility Matcher' : 'Check My Eligibility in 30 Sec'}</span>
          </button>
        </div>

        {/* Quick Quiz Dropdown */}
        {showQuiz && (
          <div
            id="eligibility-matcher-panel"
            role="region"
            aria-label="Eligibility Matcher"
            className="mt-4 pt-4 border-t border-slate-100 bg-orange-50/50 p-4 rounded-xl border border-orange-100 animate-fadeIn space-y-3"
          >
            <h4 className="font-bold text-xs text-orange-950 uppercase tracking-wide">
              Quick Eligibility Verification:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Your Age</label>
                <input
                  type="number"
                  value={quizAge}
                  aria-label="Your Age"
                  onChange={(e) => setQuizAge(e.target.value)}
                  className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Do you pay Income Tax or have PF?</label>
                <select
                  value={quizIncomeTax}
                  aria-label="Do you pay Income Tax or have PF?"
                  onChange={(e) => setQuizIncomeTax(e.target.value)}
                  className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="no">No (Unorganized / Gig worker)</option>
                  <option value="yes">Yes (Salaried / Formal)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleRunQuiz}
                  aria-label="Match eligible government schemes"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  Match Schemes
                </button>
              </div>
            </div>

            {quizResult && (
              <div
                role="status"
                aria-live="polite"
                className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-200"
              >
                {quizResult}
              </div>
            )}
          </div>
        )}

        {/* Category Filters */}
        <div role="group" aria-label="Filter schemes by category" className="mt-4 pt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-400">Filter By Category:</span>
          {['all', 'insurance', 'welfare_board', 'health', 'loan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`px-3 py-1 rounded-lg font-medium transition capitalize focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Schemes' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes List Accordion */}
      <div className="space-y-3">
        {filteredSchemes.map((scheme) => {
          const isExpanded = expandedSchemeId === scheme.id;

          return (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition"
            >
              {/* Scheme Header Card */}
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={`${language === 'en' ? scheme.title : scheme.titleHindi}, ${isExpanded ? 'collapse details' : 'expand details'}`}
                onClick={() => setExpandedSchemeId(isExpanded ? '' : scheme.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedSchemeId(isExpanded ? '' : scheme.id);
                  }
                }}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-2xl"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {language === 'en' ? scheme.title : scheme.titleHindi}
                    </span>
                    <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full capitalize">
                      {scheme.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{language === 'en' ? scheme.benefitAmount : scheme.benefitAmountHindi}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakScheme(scheme);
                    }}
                    aria-label={`Listen to details for ${language === 'en' ? scheme.title : scheme.titleHindi}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-700 transition focus:outline-none focus:ring-2 focus:ring-orange-500"
                    title="Listen aloud"
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <div className="p-2 text-slate-400" aria-hidden="true">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Scheme Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Eligibility Criteria */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Who Is Eligible?</span>
                      </h4>
                      <ul className="space-y-1 text-slate-600">
                        {scheme.eligibilityCriteria.map((crit, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-slate-400">•</span>
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Documents */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                        <FileText className="w-3.5 h-3.5 text-orange-600" />
                        <span>Documents You Need (Exact 3 items):</span>
                      </h4>
                      <ul className="space-y-1 text-slate-600">
                        {scheme.documentsRequired.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-orange-500 font-bold">✓</span>
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Step by step application guide */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs">
                      Step-by-Step How To Apply:
                    </h4>
                    <div className="space-y-1.5 text-slate-700 leading-relaxed font-medium">
                      {(language === 'en' ? scheme.applyStepsEnglish : scheme.applyStepsHindi).map((step, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Official Portal Link */}
                  <div className="flex justify-end pt-1">
                    <a
                      href={`https://${scheme.officialPortal}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                    >
                      <span>Open Official Portal ({scheme.officialPortal})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
