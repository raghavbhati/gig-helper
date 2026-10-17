'use client';

import React from 'react';
import { translations, Language, Persona } from '@/lib/translations';
import { User } from '@/lib/auth';
import {
  ShieldAlert,
  LogIn,
  LogOut,
  Languages,
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  persona: Persona;
  onPersonaChange: (p: Persona) => void;
  onOpenVoiceModal: () => void;
  isVoiceActive?: boolean;
  user?: User | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  isSyncing?: boolean;
  onTriggerSOS?: () => void;
}

const LANGUAGE_LABELS: Record<Language, string> = {
  hi: 'हिंदी',
  en: 'English',
  hinglish: 'Hinglish',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  bn: 'বাংলা',
};


export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  persona,
  onPersonaChange,
  onOpenVoiceModal,
  isVoiceActive,
  user,
  onOpenAuthModal,
  onLogout,
  isSyncing,
  onTriggerSOS,
}) => {
  const t = translations[language] || translations.en;

  return (
    <header className="bg-white/95 backdrop-blur-md text-[#102a24] shadow-xs border-b border-[#e2ece9] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">

        {/* ──── Single Row ──── */}
        <div className="flex items-center justify-between gap-2">

          {/* Left: Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0f766e] flex items-center justify-center shadow-sm text-white font-heading font-extrabold text-xl sm:text-2xl tracking-wide shrink-0">
              {language === 'en' ? 'GK' : 'गि'}
            </div>
            <div className="leading-tight min-w-0">
              <h1 className="text-lg sm:text-xl font-heading font-black tracking-tight text-[#102a24] flex items-center gap-2">
                <span className="truncate">{language === 'en' ? 'Gig Kavach' : 'गिग कवच'}</span>
                <span className="hidden sm:inline-block text-[11px] bg-[#ccfbf1] text-[#0f766e] font-sans font-bold px-2 py-0.5 rounded-full border border-[#99f6e4] whitespace-nowrap">
                  AI Co-pilot
                </span>
              </h1>
              <p className="text-[11px] text-[#5a736d] font-sans font-medium truncate hidden sm:block">
                {language === 'en' ? 'Your trusted armor & AI guardian' : 'काम में आपका भरोसेमंद सुरक्षा कवच'}
              </p>
            </div>
          </div>



          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

            {/* Language Selector */}
            <div className="relative flex items-center">
              <Languages className="w-3.5 h-3.5 text-[#0d9488] absolute left-2 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-white text-[#102a24] text-xs font-bold pl-7 pr-2 sm:pr-6 py-1.5 sm:py-2 rounded-xl border border-[#d1deda] hover:border-[#0d9488] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0d9488] cursor-pointer appearance-none transition-all"
              >
                <option value="hi">हिंदी</option>
                <option value="en">English</option>
                <option value="hinglish">Hinglish</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="bn">বাংলা</option>
              </select>
              <div className="pointer-events-none absolute right-1.5 text-[9px] text-[#718882] hidden sm:block">▼</div>
            </div>

            {/* SOS Emergency Button */}
            {onTriggerSOS && (
              <button
                onClick={onTriggerSOS}
                aria-label="Emergency SOS Alert"
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-heading font-black text-white bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 transition-all shadow-sm shadow-red-600/30"
                title="Emergency SOS & Night Safety Hotline"
              >
                <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                <span>SOS</span>
              </button>
            )}

            {/* User Login / Account */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-[#f4fbf8] border border-[#cfe9e1] px-2 sm:px-2.5 py-1 rounded-xl text-xs font-sans">
                <div className="w-6 h-6 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center font-bold text-xs border border-[#99f6e4]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left leading-tight">
                  <span className="font-bold text-[#102a24] block text-[11px] max-w-[90px] truncate">{user.name}</span>
                  <span className="text-[9px] text-[#0f766e] font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] animate-pulse" />
                    D1 Cloud
                  </span>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    aria-label="लॉगआउट करें (Log out)"
                    title="Logout"
                    className="p-1 rounded-lg text-[#718882] hover:text-[#dc2626] hover:bg-white transition focus:outline-none"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            ) : (
              onOpenAuthModal && (
                <button
                  onClick={onOpenAuthModal}
                  aria-label="लॉगिन करें या नया खाता बनाएं"
                  className="flex items-center gap-1.5 bg-white hover:bg-[#f4fbf8] text-[#102a24] border border-[#d1deda] font-bold px-2.5 sm:px-3 py-1.5 rounded-xl text-xs transition shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#0d9488]" aria-hidden="true" />
                  <span className="hidden sm:inline">लॉगिन</span>
                </button>
              )
            )}
          </div>
        </div>




      </div>
    </header>
  );
};
