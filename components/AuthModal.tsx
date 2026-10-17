'use client';

import React, { useState } from 'react';
import {
  X,
  Phone,
  Lock,
  Mail,
  User as UserIcon,
  MapPin,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
  Building2,
  PhoneCall,
} from 'lucide-react';
import { User } from '@/lib/auth';
import { Language } from '@/lib/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string) => void;
  currentLanguage: Language;
  initialMode?: 'login' | 'signup';
}

const AVAILABLE_PLATFORMS = [
  'Swiggy',
  'Zomato',
  'Uber',
  'Ola',
  'Zepto',
  'Blinkit',
  'Porter',
  'Rapido',
  'Amazon Flex',
  'Urban Company',
];

const CITIES = [
  'Delhi NCR',
  'Bengaluru',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Chennai',
  'Jaipur',
  'Ahmedabad',
  'Lucknow',
  'Chandigarh',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  currentLanguage,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      if (initialMode === 'signup') {
        setSignupStep(1);
      }
    }
  }, [initialMode, isOpen]);

  // Login Form States (Phone + Password Only)
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup Step 1 States (Phone Identifier, Email, Password)
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Signup Step 2 States (Worker Personalization)
  const [name, setName] = useState('');
  const [age, setAge] = useState('26');
  const [city, setCity] = useState('Delhi NCR');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLanguage);
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Swiggy']);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTogglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: loginPhone,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'लॉगिन विफल रहा। कृपया सही जानकारी भरें।');
      }

      setSuccessMsg('✓ सफलतापूर्वक लॉगिन हो गया! क्लाउड डेटा लोड हो रहा है...');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'लॉगिन में त्रुटि आई।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = signupPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (signupPassword.length < 4) {
      setErrorMsg('पासवर्ड कम से कम 4 अक्षरों या अंकों का होना चाहिए।');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('दोनों पासवर्ड एक जैसे होने चाहिए।');
      return;
    }

    // Advance to personalization Screen 2
    setSignupStep(2);
  };

  const handleSignupComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: signupPhone,
          email: signupEmail.trim() || undefined,
          password: signupPassword,
          name: name.trim(),
          age: parseInt(age, 10) || 26,
          city,
          language: selectedLanguage,
          emergencyPhone: emergencyPhone.replace(/\D/g, '') || undefined,
          platforms: selectedPlatforms,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'खाता बनाने में समस्या आई।');
      }

      setSuccessMsg('🎉 बधाई! आपका सुरक्षित साथी खाता बन गया है!');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'पंजीकरण में त्रुटि आई।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg flex flex-col max-h-[92vh] overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 id="auth-modal-title" className="font-bold text-sm sm:text-base text-white">
                {mode === 'login'
                  ? 'साथी लॉगिन (Sign In to Saathi)'
                  : signupStep === 1
                  ? 'नया साथी खाता (Create Account - Step 1/2)'
                  : 'कार्य व सुरक्षा प्रोफ़ाइल (Personalization - Step 2/2)'}
              </h3>
              <p className="text-[11px] text-slate-300">
                Cloudflare D1 सुरक्षित डेटा बैकअप • किसी भी फोन पर जारी रखें
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close authentication dialog"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Mode Selector Tabs (Sign In vs Sign Up) */}
        <div role="tablist" aria-label="Authentication mode" className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              mode === 'login'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            लॉगिन करें (Sign In)
          </button>
          <button
            role="tab"
            aria-selected={mode === 'signup'}
            onClick={() => {
              setMode('signup');
              setSignupStep(1);
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center transition border-b-2 ${
              mode === 'signup'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            खाता बनाएं (Create Account)
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          
          {errorMsg && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2 font-medium"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              role="status"
              className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 font-bold"
            >
              <Check className="w-4 h-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= MODE: LOGIN ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />
                  <span>मोबाइल नंबर (10-Digit Mobile Number) *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    aria-label="10-digit mobile number"
                    className="w-full bg-slate-50 pl-12 pr-3 py-2 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />
                  <span>पासवर्ड या पिन (Password / PIN) *</span>
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="अपना पासवर्ड या 4-अंकीय पिन दर्ज करें"
                    aria-label="Password or PIN"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl text-sm transition shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>{isLoading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें (Sign In)'}</span>
              </button>
            </form>
          )}

          {/* ================= MODE: SIGNUP STEP 1 ================= */}
          {mode === 'signup' && signupStep === 1 && (
            <form onSubmit={handleSignupStep1Next} className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />
                  <span>मोबाइल नंबर (मुख्य पहचान / Primary Identifier) *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    aria-label="10-digit mobile number for signup"
                    className="w-full bg-slate-50 pl-12 pr-3 py-2 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  यह नंबर आपकी साथी आईडी बनेगा और लॉगिन के लिए उपयोग होगा।
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <span>ईमेल पता (Email Address - वैकल्पिक / Optional)</span>
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  aria-label="Email address"
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />
                  <span>पासवर्ड बनाएं (Create Password / PIN) *</span>
                </label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="कम से कम 4 अक्षर या अंक"
                    aria-label="Create Password"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">पासवर्ड की पुष्टि करें (Confirm Password) *</label>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  required
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder="वही पासवर्ड दोबारा लिखें"
                  aria-label="Confirm Password"
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
              >
                <span>अगला: प्रोफाइल जानकारी (Next: Personalization)</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          )}

          {/* ================= MODE: SIGNUP STEP 2 (PERSONALIZATION) ================= */}
          {mode === 'signup' && signupStep === 2 && (
            <form onSubmit={handleSignupComplete} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />
                    <span>पूरा नाम (Full Name) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. राजू कुमार"
                    aria-label="Full Name"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>उम्र (Age)</span>
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="26"
                    aria-label="Age"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>शहर (City)</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-label="Select City"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">पसंदीदा भाषा (Language)</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                    aria-label="Select Language"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="en">English</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                  <span>इमरजेंसी फोन नंबर (Emergency SOS Contact)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="परिवार या दोस्त का नंबर"
                    aria-label="Emergency contact phone number"
                    className="w-full bg-slate-50 pl-12 pr-3 py-2 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  सड़क हादसे या खतरे के समय Safety Hub 1-क्लिक में इसी नंबर पर SOS भेजेगा।
                </p>
              </div>

              {/* Multi-Select Platforms Where You Work */}
              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />
                  <span>आप किन प्लेटफॉर्म्स पर काम करते हैं? (Select Where You Work) *</span>
                </label>
                <div role="group" aria-label="Platforms selection" className="flex flex-wrap gap-2">
                  {AVAILABLE_PLATFORMS.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform);
                    return (
                      <button
                        type="button"
                        key={platform}
                        onClick={() => handleTogglePlatform(platform)}
                        aria-pressed={isSelected}
                        className={`px-3 py-1.5 rounded-xl font-bold transition text-xs flex items-center gap-1.5 border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          isSelected
                            ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                        <span>{platform}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSignupStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>पीछे (Back)</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl text-sm transition shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>{isLoading ? 'खाता बन रहा है...' : '✓ खाता पूरा करें (Complete Signup)'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Footer: Guest Option */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline transition focus:outline-none"
          >
            बिना लॉगिन जारी रखें (Continue as Guest in Local Mode)
          </button>
        </div>

      </div>
    </div>
  );
};
