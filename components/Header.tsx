'use client';

import React from 'react';
import { translations, Language, Persona } from '@/lib/translations';
import { Bike, Car, Hammer, Globe, Volume2, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  persona: Persona;
  onPersonaChange: (p: Persona) => void;
  onOpenVoiceModal: () => void;
  isVoiceActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  persona,
  onPersonaChange,
  onOpenVoiceModal,
  isVoiceActive,
}) => {
  const t = translations[language] || translations.en;

  return (
    <header className="bg-slate-900 text-white shadow-xl border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white font-black text-xl">
                सा
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  {t.appName}
                  <span className="text-xs bg-orange-500/20 text-orange-400 font-semibold px-2 py-0.5 rounded-full border border-orange-500/30">
                    GenAI Guardian
                  </span>
                </h1>
                <p className="text-xs text-slate-400 line-clamp-1">{t.tagline}</p>
              </div>
            </div>

            {/* Quick Voice Mic Button on Mobile */}
            <button
              onClick={onOpenVoiceModal}
              className={`sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isVoiceActive
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-orange-600 hover:bg-orange-500 text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice</span>
            </button>
          </div>

          {/* Right Controls: Persona & Language Switcher & Voice */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            
            {/* Persona Switcher */}
            <div className="bg-slate-800/90 p-1 rounded-xl flex items-center gap-1 border border-slate-700 text-xs">
              <button
                onClick={() => onPersonaChange('delivery')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  persona === 'delivery'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Delivery Partner"
              >
                <Bike className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Delivery</span>
              </button>

              <button
                onClick={() => onPersonaChange('driver')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  persona === 'driver'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Cab / Auto Driver"
              >
                <Car className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Driver</span>
              </button>

              <button
                onClick={() => onPersonaChange('daily_wage')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  persona === 'daily_wage'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Daily Wage / Construction"
              >
                <Hammer className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Laborer</span>
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-slate-800 text-slate-200 text-xs font-semibold pl-8 pr-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="hinglish">Hinglish</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>

            {/* Desktop Voice Button */}
            <button
              onClick={onOpenVoiceModal}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                isVoiceActive
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-orange-600/20'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{t.voiceButtonStart}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
