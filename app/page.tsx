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
import { THEME_COLORS, UI_STYLES } from '@/lib/theme';
import {
  Home,
  IndianRupee,
  Scale,
  Building2,
  FileSearch,
  ShieldAlert,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Briefcase,
  Clock,
  TrendingDown,
  Lightbulb,
  LifeBuoy,
  FileCheck2,
  Plus,
  ClipboardList,
} from 'lucide-react';

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('hi');
  const [persona, setPersona] = useState<Persona>('delivery');
  const [activeTab, setActiveTab] = useState<'home' | 'earnings' | 'dispute' | 'welfare' | 'docs' | 'safety'>('home');
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

  // Show hardcoded demo data for guests (not logged in) and demo account;
  // real logged-in users see their actual (empty) state.
  const DEMO_PHONE = '7737309096';
  const isDemoView = !user || user.phoneNumber === DEMO_PHONE;

  // Hydrate session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserStr = localStorage.getItem('gig_kavach_user') || localStorage.getItem('saathi_user');
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
            localStorage.setItem('gig_kavach_user', JSON.stringify(data.user));
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
    localStorage.setItem('gig_kavach_user', JSON.stringify(authUser));
    if (authUser.language) {
      setLanguage(authUser.language as Language);
    }

    // Auto-sync local shifts to Cloudflare D1
    setIsSyncing(true);
    try {
      const savedLogsStr = localStorage.getItem('gig_kavach_earnings_log') || localStorage.getItem('saathi_earnings_log');
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
        setSyncToast(`✓ स्वागत है ${authUser.name}! गिग कवच में आपका स्वागत है।`);
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
    localStorage.removeItem('gig_kavach_user');
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

  // Localized date string matching screenshot (e.g. शनिवार, 17 अक्टूबर)
  const getFormattedDate = () => {
    try {
      const date = new Date();
      if (language === 'hi') {
        const weekdays = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
        const months = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
        return `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
      }
      return date.toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    } catch {
      return 'शनिवार, 17 अक्टूबर';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans pb-28 text-[#102a24]">
      
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
        onTriggerSOS={() => setActiveTab('safety')}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-5 w-full flex-1 space-y-6">
        
        {/* Hero Section matching screenshot */}
        <section className="space-y-1">
          <div className="text-xs font-semibold text-[#0f766e] tracking-tight">
            {getFormattedDate()}
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#102a24] tracking-tight">
            नमस्ते, {user?.name || 'रवि जी'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#4a5f59] font-medium pt-0.5">
            आज की कमाई और आपके काम की ज़रूरी मदद — सब एक जगह।
          </p>
        </section>

        {/* Home Screen View */}
        {activeTab === 'home' && (
          <div className="space-y-5 animate-fadeIn">

            {isDemoView ? (
              <>
                {/* ===== DEMO / GUEST VIEW: Showcase hardcoded data ===== */}

                {/* 1. Signature Hero Earnings Card */}
                <div className="bg-[#0d3830] text-white rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-lg border border-[#114a40]/60">
                  <div
                    className="absolute -right-6 -bottom-8 w-48 h-48 sm:w-56 sm:h-56 rounded-full border-[10px] border-white/5 flex items-center justify-center pointer-events-none select-none bg-white/[0.03]"
                    aria-hidden="true"
                  >
                    <span className="text-8xl sm:text-9xl font-heading font-extrabold text-white/10">₹</span>
                  </div>
                  <div className="relative z-10 space-y-3 max-w-[80%]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#99f6e4] tracking-wide">
                      <Briefcase className="w-4 h-4 text-[#5eead4]" />
                      <span>आज की कमाई</span>
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white">₹1,250</div>
                      <div className="text-xs text-[#cfe9e1] font-medium mt-1">14 डिलीवरी पूरी</div>
                    </div>
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/15 px-3 py-1 rounded-full border border-white/15 transition backdrop-blur-xs">
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#5eead4]" />
                        <span>कल से ₹180 ज़्यादा</span>
                      </div>
                    </div>
                  </div>
                  {/* Demo badge for guests */}
                  {!user && (
                    <div className="absolute top-3 right-3 z-10 text-[10px] font-bold bg-white/15 text-[#99f6e4] px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                      Demo Data
                    </div>
                  )}
                </div>

                {/* 2. Advice Card */}
                <div className="bg-white rounded-2xl p-5 border border-[#e2ece9] shadow-sm space-y-3 transition hover:border-[#99f6e4]">
                  <div className="w-9 h-9 rounded-xl bg-[#fef3c7] flex items-center justify-center border border-[#fde68a] text-[#d97706]">
                    <Lightbulb className="w-5 h-5 fill-[#d97706]/20 text-[#d97706]" />
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#102a24]">आज की छोटी सलाह</h3>
                    <p className="text-xs sm:text-sm text-[#4a5f59] mt-1 leading-relaxed">
                      पेट्रोल का खर्च रोज़ लिखें — महीने के आखिर में पता चलेगा असली बचत कितनी हुई।
                    </p>
                  </div>
                  <div className="pt-1">
                    <button
                      onClick={() => setActiveTab('earnings')}
                      className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1 transition"
                    >
                      <span>गिग कवच की सलाह · 1 मिनट पढ़ें</span>
                    </button>
                  </div>
                </div>

                {/* 3. Quick Stats Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button onClick={() => setActiveTab('earnings')} className="bg-white hover:bg-[#f4fbf8] p-3.5 rounded-xl border border-[#e2ece9] hover:border-[#99f6e4] text-left transition shadow-xs group">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#102a24]">
                      <Briefcase className="w-4 h-4 text-[#0f766e] group-hover:scale-110 transition-transform" />
                      <span>काम के घंटे</span>
                    </div>
                    <div className="text-xs text-[#5a736d] mt-1">10 घंटे दर्ज</div>
                  </button>
                  <button onClick={() => setActiveTab('earnings')} className="bg-white hover:bg-[#f4fbf8] p-3.5 rounded-xl border border-[#e2ece9] hover:border-[#99f6e4] text-left transition shadow-xs group">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#102a24]">
                      <IndianRupee className="w-4 h-4 text-[#0d9488] group-hover:scale-110 transition-transform" />
                      <span>हाथ में आए</span>
                    </div>
                    <div className="text-xs text-emerald-700 font-semibold mt-1">₹781 शुद्ध बचत</div>
                  </button>
                  <button onClick={() => setActiveTab('dispute')} className="bg-white hover:bg-[#fef2f2] p-3.5 rounded-xl border border-[#e2ece9] hover:border-[#fecaca] text-left transition shadow-xs group">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#dc2626]">
                      <TrendingDown className="w-4 h-4 text-[#dc2626] group-hover:scale-110 transition-transform" />
                      <span>प्लेटफ़ॉर्म कटौती</span>
                    </div>
                    <div className="text-xs text-[#dc2626] font-semibold mt-1">-₹350 पेनल्टी</div>
                  </button>
                  <button onClick={() => setActiveTab('welfare')} className="bg-white hover:bg-[#f4fbf8] p-3.5 rounded-xl border border-[#e2ece9] hover:border-[#99f6e4] text-left transition shadow-xs group">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#102a24]">
                      <CheckCircle2 className="w-4 h-4 text-[#0f766e] group-hover:scale-110 transition-transform" />
                      <span>इस हफ़्ते</span>
                    </div>
                    <div className="text-xs text-[#5a736d] mt-1">₹8,450 कुल योग</div>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* ===== REAL USER: Empty / Onboarding State ===== */}

                {/* Welcome Card */}
                <div className="bg-[#0d3830] text-white rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-lg border border-[#114a40]/60">
                  <div
                    className="absolute -right-6 -bottom-8 w-48 h-48 sm:w-56 sm:h-56 rounded-full border-[10px] border-white/5 flex items-center justify-center pointer-events-none select-none bg-white/[0.03]"
                    aria-hidden="true"
                  >
                    <span className="text-8xl sm:text-9xl font-heading font-extrabold text-white/10">₹</span>
                  </div>
                  <div className="relative z-10 space-y-3 max-w-[85%]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#99f6e4] tracking-wide">
                      <Sparkles className="w-4 h-4 text-[#5eead4]" />
                      <span>आज की कमाई</span>
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white/40">₹0</div>
                      <div className="text-xs text-[#cfe9e1]/70 font-medium mt-1">
                        अभी तक कोई शिफ्ट दर्ज नहीं हुई
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveTab('earnings')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0d9488] hover:bg-[#0f766e] px-4 py-2 rounded-full transition shadow-sm active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>पहली शिफ्ट दर्ज करें</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Getting Started Guide */}
                <div className="bg-white rounded-2xl p-5 border border-[#e2ece9] shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#ccfbf1] flex items-center justify-center border border-[#99f6e4] text-[#0f766e]">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-heading font-bold text-[#102a24]">
                      शुरू कैसे करें? (Getting Started)
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => setActiveTab('earnings')}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#f4fbf8] hover:bg-[#e6f5f0] border border-[#e2ece9] hover:border-[#99f6e4] text-left transition group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#0d9488] text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#102a24]">कमाई दर्ज करें</div>
                        <div className="text-[11px] text-[#5a736d]">डिलीवरी स्लिप अपलोड या मैनुअल एंट्री करें</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#718882] group-hover:text-[#0d9488] shrink-0 transition" />
                    </button>

                    <button
                      onClick={() => setActiveTab('dispute')}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#f4fbf8] hover:bg-[#e6f5f0] border border-[#e2ece9] hover:border-[#99f6e4] text-left transition group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#0d9488] text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#102a24]">गलत कटौती की शिकायत करें</div>
                        <div className="text-[11px] text-[#5a736d]">AI से कानूनी शिकायत पत्र तैयार करें</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#718882] group-hover:text-[#0d9488] shrink-0 transition" />
                    </button>

                    <button
                      onClick={() => setActiveTab('welfare')}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#f4fbf8] hover:bg-[#e6f5f0] border border-[#e2ece9] hover:border-[#99f6e4] text-left transition group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#0d9488] text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#102a24]">सरकारी योजनाएं खोजें</div>
                        <div className="text-[11px] text-[#5a736d]">आपके लिए उपलब्ध बीमा और लाभ देखें</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#718882] group-hover:text-[#0d9488] shrink-0 transition" />
                    </button>
                  </div>
                </div>

                {/* Advice Card (keep for all users) */}
                <div className="bg-white rounded-2xl p-5 border border-[#e2ece9] shadow-sm space-y-3 transition hover:border-[#99f6e4]">
                  <div className="w-9 h-9 rounded-xl bg-[#fef3c7] flex items-center justify-center border border-[#fde68a] text-[#d97706]">
                    <Lightbulb className="w-5 h-5 fill-[#d97706]/20 text-[#d97706]" />
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#102a24]">आज की छोटी सलाह</h3>
                    <p className="text-xs sm:text-sm text-[#4a5f59] mt-1 leading-relaxed">
                      पेट्रोल का खर्च रोज़ लिखें — महीने के आखिर में पता चलेगा असली बचत कितनी हुई।
                    </p>
                  </div>
                  <div className="pt-1">
                    <button
                      onClick={() => setActiveTab('earnings')}
                      className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1 transition"
                    >
                      <span>गिग कवच की सलाह · 1 मिनट पढ़ें</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Quick Access to Main Features Cards (shown for all) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div
                onClick={() => setActiveTab('earnings')}
                className="bg-gradient-to-br from-white to-[#f4fbf8] p-4 rounded-2xl border border-[#e2ece9] hover:border-[#14b8a6] cursor-pointer transition shadow-xs space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#ccfbf1] text-[#0f766e] rounded-xl font-bold">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-[#102a24]">
                      {t.tabs.earnings}
                    </h4>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#718882] group-hover:text-[#0d9488] group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-xs text-[#5a736d]">
                  अपनी डिलीवरी स्लिप अपलोड करें, असली बचत और कटौती की AI जांच करें।
                </p>
              </div>

              <div
                onClick={() => setActiveTab('dispute')}
                className="bg-gradient-to-br from-white to-[#f4fbf8] p-4 rounded-2xl border border-[#e2ece9] hover:border-[#14b8a6] cursor-pointer transition shadow-xs space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#ccfbf1] text-[#0f766e] rounded-xl font-bold">
                      <Scale className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-[#102a24]">
                      {t.tabs.dispute}
                    </h4>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#718882] group-hover:text-[#0d9488] group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-xs text-[#5a736d]">
                  बारिश या देरी के गलत जुर्मानों के खिलाफ कानूनी शिकायत पत्र तैयार करें।
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Tab 1: Detailed Earnings Audit */}
        {activeTab === 'earnings' && (
          <div className="animate-fadeIn">
            <EarningsAuditTab
              language={language}
              persona={persona}
              onNavigateToDispute={handleNavigateToDispute}
              user={user}
              onOpenAuthModal={() => setIsAuthOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Dispute Grievance Drafter */}
        {activeTab === 'dispute' && (
          <div className="animate-fadeIn">
            <DisputeDrafterTab
              language={language}
              persona={persona}
              prefillData={disputePrefill}
            />
          </div>
        )}

        {/* Tab 3: Welfare Schemes & Rights */}
        {activeTab === 'welfare' && (
          <div className="animate-fadeIn">
            <WelfareSchemesTab
              language={language}
              persona={persona}
            />
          </div>
        )}

        {/* Tab 4: Document Explainer */}
        {activeTab === 'docs' && (
          <div className="animate-fadeIn">
            <DocumentExplainerTab
              language={language}
              persona={persona}
            />
          </div>
        )}

        {/* Tab 5: Safety & Emergency Hub */}
        {activeTab === 'safety' && (
          <div className="animate-fadeIn">
            <SafetyHubTab
              language={language}
              persona={persona}
            />
          </div>
        )}

      </main>

      {/* Floating Action Button ("मदद पूछें" pill matching screenshot) */}
      <div className="fixed bottom-20 sm:bottom-22 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="bg-[#0d3830] hover:bg-[#0a2e27] text-white px-5 py-3 rounded-full shadow-xl shadow-[#0d3830]/40 flex items-center gap-2.5 font-heading font-bold text-sm transition-all transform hover:scale-105 active:scale-95 border border-[#174a40]"
          title="Gig Kavach AI Assistant"
        >
          <MessageSquare className="w-4 h-4 fill-white text-white" />
          <span>मदद पूछें</span>
        </button>
      </div>

      {/* Docked Bottom Navigation Bar (Matching Screenshot UI) */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e2ece9] shadow-lg"
      >
        <div className="max-w-md sm:max-w-xl mx-auto px-4 py-2 flex items-center justify-around gap-1">
          
          {/* 1. Home Tab (Active pill styling from screenshot) */}
          <button
            onClick={() => setActiveTab('home')}
            aria-label="होम (Home)"
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all ${
              activeTab === 'home'
                ? 'bg-[#ccfbf1] text-[#0f766e]'
                : 'text-[#5a736d] hover:text-[#102a24] hover:bg-[#f4fbf8]'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-xs font-heading font-bold leading-tight">होम</span>
            <span className="text-[9px] font-sans opacity-70">Home</span>
          </button>

          {/* 2. Earnings Tab */}
          <button
            onClick={() => setActiveTab('earnings')}
            aria-label="कमाई (Earnings)"
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all ${
              activeTab === 'earnings'
                ? 'bg-[#ccfbf1] text-[#0f766e]'
                : 'text-[#5a736d] hover:text-[#102a24] hover:bg-[#f4fbf8]'
            }`}
          >
            <IndianRupee className="w-5 h-5 mb-0.5" />
            <span className="text-xs font-heading font-bold leading-tight">कमाई</span>
            <span className="text-[9px] font-sans opacity-70">Earnings</span>
          </button>

          {/* 3. Dispute Tab */}
          <button
            onClick={() => setActiveTab('dispute')}
            aria-label="विवाद (Disputes)"
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all relative ${
              activeTab === 'dispute'
                ? 'bg-[#ccfbf1] text-[#0f766e]'
                : 'text-[#5a736d] hover:text-[#102a24] hover:bg-[#f4fbf8]'
            }`}
          >
            <Scale className="w-5 h-5 mb-0.5" />
            <span className="text-xs font-heading font-bold leading-tight">विवाद</span>
            <span className="text-[9px] font-sans opacity-70">Disputes</span>
            {disputePrefill && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#dc2626] animate-ping" />
            )}
          </button>

          {/* 4. Welfare Schemes Tab */}
          <button
            onClick={() => setActiveTab('welfare')}
            aria-label="योजनाएं (Schemes)"
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all ${
              activeTab === 'welfare'
                ? 'bg-[#ccfbf1] text-[#0f766e]'
                : 'text-[#5a736d] hover:text-[#102a24] hover:bg-[#f4fbf8]'
            }`}
          >
            <Building2 className="w-5 h-5 mb-0.5" />
            <span className="text-xs font-heading font-bold leading-tight">योजनाएं</span>
            <span className="text-[9px] font-sans opacity-70">Schemes</span>
          </button>

          {/* 5. Safety & Help Tab (Matches Lifebuoy Help icon from screenshot) */}
          <button
            onClick={() => setActiveTab('safety')}
            aria-label="मदद (Help)"
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all ${
              activeTab === 'safety'
                ? 'bg-[#ccfbf1] text-[#0f766e]'
                : 'text-[#5a736d] hover:text-[#102a24] hover:bg-[#f4fbf8]'
            }`}
          >
            <LifeBuoy className="w-5 h-5 mb-0.5" />
            <span className="text-xs font-heading font-bold leading-tight">मदद</span>
            <span className="text-[9px] font-sans opacity-70">Help</span>
          </button>

        </div>
      </nav>

      {/* Multilingual Voice Assistant Modal */}
      <VoiceAssistant
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={language}
        persona={persona}
        onTransferToDispute={handleVoiceTransfer}
      />

      {/* Cloudflare D1 Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        currentLanguage={language}
      />

      {/* Cloud Sync Status Toast */}
      {syncToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#0d3830] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#174a40] text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fadeIn backdrop-blur-md"
        >
          <CheckCircle2 className="w-4 h-4 text-[#5eead4] shrink-0" aria-hidden="true" />
          <span>{syncToast}</span>
        </div>
      )}

    </div>
  );
}
