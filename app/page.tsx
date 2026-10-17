'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { EarningsAuditTab } from '@/components/EarningsAuditTab';
import { DisputeDrafterTab } from '@/components/DisputeDrafterTab';
import { WelfareSchemesTab } from '@/components/WelfareSchemesTab';
import { DocumentExplainerTab } from '@/components/DocumentExplainerTab';
import { SafetyHubTab } from '@/components/SafetyHubTab';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { AuthModal } from '@/components/AuthModal';
import { Language, Persona, translations } from '@/lib/translations';
import { User } from '@/lib/auth';
import {
  DollarSign,
  Scale,
  Building2,
  FileSearch,
  ShieldAlert,
  Mic,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('hi');
  const [persona, setPersona] = useState<Persona>('delivery');
  const [activeTab, setActiveTab] = useState<'earnings' | 'dispute' | 'welfare' | 'docs' | 'safety'>('earnings');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Authentication & Cloud Sync States
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Cross-tab state sharing
  const [disputePrefill, setDisputePrefill] = useState<{
    platform: string;
    description: string;
    amount: string;
    orderId: string;
  } | null>(null);

  const t = translations[language] || translations.en;

  // Hydrate session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserStr = localStorage.getItem('saathi_user');
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);
          if (parsed.language) setLanguage(parsed.language);
        } catch (e) {
          console.warn('Could not parse cached user:', e);
        }
      }

      // Check server session cookie
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setUser(data.user);
            localStorage.setItem('saathi_user', JSON.stringify(data.user));
            if (data.user.language) setLanguage(data.user.language);
          }
        })
        .catch(() => {
          // Offline mode or no server session
        });
    }
  }, []);

  const handleAuthSuccess = async (authUser: User, token: string) => {
    setUser(authUser);
    localStorage.setItem('saathi_user', JSON.stringify(authUser));
    if (authUser.language) {
      setLanguage(authUser.language as Language);
    }

    // Auto-sync local shifts to Cloudflare D1
    setIsSyncing(true);
    try {
      const savedLogsStr = localStorage.getItem('saathi_earnings_log');
      const shifts = savedLogsStr ? JSON.parse(savedLogsStr) : [];

      if (shifts.length > 0) {
        const res = await fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shifts }),
        });
        const syncData = await res.json();
        setSyncToast(`✓ स्वागत है ${authUser.name}! आपकी ${syncData.totalSynced || shifts.length} शिफ्ट्स D1 क्लाउड में सुरक्षित सिंक हो गईं।`);
      } else {
        setSyncToast(`✓ स्वागत है ${authUser.name}! साथी में आपका स्वागत है।`);
      }
    } catch {
      setSyncToast(`✓ स्वागत है ${authUser.name}!`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncToast(null), 4000);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout error:', e);
    }
    setUser(null);
    localStorage.removeItem('saathi_user');
    setSyncToast('✓ सफलतापूर्वक लॉगआउट हो गया।');
    setTimeout(() => setSyncToast(null), 3000);
  };

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
        user={user}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        isSyncing={isSyncing}
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

      {/* Cloudflare D1 Phone Auth & Personalization Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        currentLanguage={language}
      />

      {/* Cloud Sync Status Toast Notification */}
      {syncToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fadeIn backdrop-blur-md"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{syncToast}</span>
        </div>
      )}

    </div>
  );
}
