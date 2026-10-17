'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { EarningsAuditTab } from '@/components/EarningsAuditTab';
import { DisputeDrafterTab } from '@/components/DisputeDrafterTab';
import { WelfareSchemesTab } from '@/components/WelfareSchemesTab';
import { DocumentExplainerTab } from '@/components/DocumentExplainerTab';
import { SafetyHubTab } from '@/components/SafetyHubTab';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { Language, Persona, translations } from '@/lib/translations';
import {
  DollarSign,
  Scale,
  Building2,
  FileSearch,
  ShieldAlert,
  Mic,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('hi');
  const [persona, setPersona] = useState<Persona>('delivery');
  const [activeTab, setActiveTab] = useState<'earnings' | 'dispute' | 'welfare' | 'docs' | 'safety'>('earnings');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Cross-tab state sharing
  const [disputePrefill, setDisputePrefill] = useState<{
    platform: string;
    description: string;
    amount: string;
    orderId: string;
  } | null>(null);

  const t = translations[language] || translations.en;

  const handleNavigateToDispute = (data: {
    platform: string;
    description: string;
    amount: string;
    orderId: string;
  }) => {
    setDisputePrefill(data);
    setActiveTab('dispute');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVoiceTransfer = (text: string) => {
    setDisputePrefill({
      platform: 'Platform Aggregator',
      description: text,
      amount: '350',
      orderId: 'VOICE-INCIDENT',
    });
    setActiveTab('dispute');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-20">
      
      {/* Top App Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        persona={persona}
        onPersonaChange={setPersona}
        onOpenVoiceModal={() => setIsVoiceOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-5 w-full flex-1 space-y-5">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 overflow-x-auto scrollbar-none flex items-center justify-between gap-1">
          
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === 'earnings'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <DollarSign className={`w-4 h-4 ${activeTab === 'earnings' ? 'text-orange-400' : 'text-slate-400'}`} />
            <span>{t.tabs.earnings}</span>
          </button>

          <button
            onClick={() => setActiveTab('dispute')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === 'dispute'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Scale className={`w-4 h-4 ${activeTab === 'dispute' ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{t.tabs.dispute}</span>
            {disputePrefill && (
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('welfare')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === 'welfare'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className={`w-4 h-4 ${activeTab === 'welfare' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{t.tabs.welfare}</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === 'docs'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileSearch className={`w-4 h-4 ${activeTab === 'docs' ? 'text-blue-400' : 'text-slate-400'}`} />
            <span>{t.tabs.docs}</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === 'safety'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 ${activeTab === 'safety' ? 'text-rose-400' : 'text-slate-400'}`} />
            <span>{t.tabs.safety}</span>
          </button>

        </div>

        {/* Tab Views */}
        <div>
          {activeTab === 'earnings' && (
            <EarningsAuditTab
              language={language}
              persona={persona}
              onNavigateToDispute={handleNavigateToDispute}
            />
          )}

          {activeTab === 'dispute' && (
            <DisputeDrafterTab
              language={language}
              persona={persona}
              prefillData={disputePrefill}
            />
          )}

          {activeTab === 'welfare' && (
            <WelfareSchemesTab
              language={language}
              persona={persona}
            />
          )}

          {activeTab === 'docs' && (
            <DocumentExplainerTab
              language={language}
              persona={persona}
            />
          )}

          {activeTab === 'safety' && (
            <SafetyHubTab
              language={language}
              persona={persona}
            />
          )}
        </div>

      </main>

      {/* Floating Voice Co-pilot Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white p-4 rounded-full shadow-2xl shadow-orange-600/50 flex items-center gap-2 font-bold transition-all transform hover:scale-105 active:scale-95 group"
          title="Speak to Saathi AI"
        >
          <Mic className="w-6 h-6 animate-pulse" />
          <span className="hidden sm:inline text-xs pr-1">बोलें / Speak</span>
        </button>
      </div>

      {/* Interactive Voice Modal Dialog */}
      <VoiceAssistant
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={language}
        persona={persona}
        onTransferToDispute={handleVoiceTransfer}
      />

    </div>
  );
}
