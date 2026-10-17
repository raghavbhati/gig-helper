'use client';

import React, { useState } from 'react';
import { sampleDocuments, SampleDoc } from '@/lib/sampleData';
import { Language, Persona } from '@/lib/translations';
import {
  FileSearch,
  Upload,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Volume2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface DocumentExplainerTabProps {
  language: Language;
  persona: Persona;
}

export const DocumentExplainerTab: React.FC<DocumentExplainerTabProps> = ({
  language,
  persona,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<SampleDoc>(sampleDocuments[0]);
  const [customText, setCustomText] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);

  const handleSelectDoc = (doc: SampleDoc) => {
    setSelectedDoc(doc);
    setCustomText('');
  };

  const handleExplainCustom = async () => {
    if (!customText.trim()) return;
    setIsExplaining(true);
    try {
      const res = await fetch('/api/explain-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: customText,
          language,
        }),
      });

      const data = await res.json();
      setSelectedDoc({
        id: 'custom-' + Date.now(),
        title: 'Custom User Provided Document / Clause',
        type: 'contract',
        originalExcerpt: customText,
        simplifiedWhatIsIt: data.simplifiedWhatIsIt || "यह कंपनी का नियम दस्तावेज़ है।",
        simplifiedImpact: data.simplifiedImpact || "यह आपकी कमाई और आईडी पर असर डाल सकता है।",
        recommendedAction: data.recommendedAction || "सबूत संभाल कर रखें।",
        trapWarning: data.trapWarning,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsExplaining(false);
    }
  };

  const speakDocument = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = `${selectedDoc.simplifiedWhatIsIt}. असर: ${selectedDoc.simplifiedImpact}. आपको क्या करना चाहिए: ${selectedDoc.recommendedAction}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Sample Presets */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-orange-600" />
              <span>Document & Contract Plain-Language Explainer</span>
              <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded-full">
                Zero-Legalese
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Contracts are written to protect corporations, not workers. Paste any clause or warning letter to decode hidden traps in 3 simple bullets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Sample Clauses:</span>
            {sampleDocuments.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleSelectDoc(doc)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition border ${
                  selectedDoc.id === doc.id
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {doc.type === 'contract' ? '📄 Unilateral Termination' : doc.type === 'insurance_claim' ? '🏥 Insurance Trap' : '⚖️ Arbitration Waiver'}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <textarea
            rows={2}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Or paste any confusing contract text, warning email, or show-cause notice here..."
            className="flex-1 bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleExplainCustom}
            disabled={isExplaining || !customText.trim()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isExplaining ? 'Simplifying...' : 'Decode Clause'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Output Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Col: Original Legal Jargon Excerpt */}
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-mono text-orange-400 uppercase tracking-wider block">
              Original Legal Clause / Contract Text
            </span>
            <h3 className="font-bold text-sm text-white mt-1">
              {selectedDoc.title}
            </h3>
            <p className="mt-3 text-xs text-slate-300 font-mono leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              "{selectedDoc.originalExcerpt}"
            </p>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            Platform agreements frequently bury clauses that waive worker remedies.
          </div>
        </div>

        {/* Right 2 Cols: Plain Language 3-Bullet Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Trap Warning Alert */}
          {selectedDoc.trapWarning && (
            <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded-2xl shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Predatory Clause Red Flag</span>
              </div>
              <p className="text-xs text-rose-950 font-medium leading-relaxed">
                {selectedDoc.trapWarning}
              </p>
            </div>
          )}

          {/* 3 Simple Questions Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                The 3-Bullet Plain Language Breakdown
              </h3>
              <button
                onClick={speakDocument}
                className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 border border-orange-200 transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Aloud</span>
              </button>
            </div>

            {/* Bullet 1: What is it? */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800">
                  Yeh Kagaz / Niyam Kya Hai? (What is this rule?)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {selectedDoc.simplifiedWhatIsIt}
                </p>
              </div>
            </div>

            {/* Bullet 2: What is the impact? */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800">
                  Aapki Kamai Aur Rozgar Par Asar? (Impact on your income)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {selectedDoc.simplifiedImpact}
                </p>
              </div>
            </div>

            {/* Bullet 3: What to do now? */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800">
                  Aapko Abhi Kya Karna Chahiye? (What action should you take?)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {selectedDoc.recommendedAction}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
