'use client';

import React, { useState } from 'react';
import { Language, Persona } from '@/lib/translations';
import {
  ShieldAlert,
  CloudRain,
  SunMedium,
  PhoneCall,
  MapPin,
  Ambulance,
  HeartPulse,
  AlertOctagon,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface SafetyHubTabProps {
  language: Language;
  persona: Persona;
}

export const SafetyHubTab: React.FC<SafetyHubTabProps> = ({
  language,
  persona,
}) => {
  const [sosSent, setSosSent] = useState(false);
  const [activeWeatherMode, setActiveWeatherMode] = useState<'rain' | 'heat'>('rain');

  const handleTriggerSOS = () => {
    setSosSent(true);
    const emergencyMessage = `EMERGENCY ALERT: I am on duty as a ${persona} and require immediate assistance. Location: Near Sector 62 / Ring Road Junction. Please call emergency services or check in immediately.`;
    const url = `sms:?body=${encodeURIComponent(emergencyMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Panic SOS Button */}
      <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-rose-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-rose-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                Emergency Guardian
              </span>
              <h2 className="text-lg font-bold text-white">
                Safety Practices & SOS Emergency Response
              </h2>
            </div>
            <p className="text-xs text-rose-200/80">
              Immediate panic broadcaster for on-road accidents, harassment, or severe weather distress.
            </p>
          </div>

          {/* SOS Trigger */}
          <button
            onClick={handleTriggerSOS}
            className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-black rounded-2xl shadow-xl shadow-rose-600/40 flex items-center justify-center gap-2 text-sm transition"
          >
            <AlertOctagon className="w-5 h-5 animate-spin" />
            <span>{sosSent ? 'SOS Broadcaster Triggered!' : 'TRIGGER PANIC SOS'}</span>
          </button>
        </div>

        {sosSent && (
          <div className="mt-4 p-3 bg-rose-800/60 rounded-xl border border-rose-700 text-xs text-rose-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Emergency dispatch payload generated with simulated GPS coordinates and SMS draft opened for emergency contacts.
            </span>
          </div>
        )}
      </div>

      {/* Weather Safety Advisory Toggle */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-600" />
            <span>Shift Hazard & Climate Advisory</span>
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveWeatherMode('rain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition border ${
                activeWeatherMode === 'rain'
                  ? 'bg-blue-600 text-white border-blue-600 shadow'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Monsoon & Waterlogging</span>
            </button>

            <button
              onClick={() => setActiveWeatherMode('heat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition border ${
                activeWeatherMode === 'heat'
                  ? 'bg-amber-600 text-white border-amber-600 shadow'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <SunMedium className="w-3.5 h-3.5" />
              <span>Severe Heatwave (&gt;42°C)</span>
            </button>
          </div>
        </div>

        {/* Advisory Content */}
        {activeWeatherMode === 'rain' ? (
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-blue-600" />
              <span>Monsoon High-Risk Road Protocol:</span>
            </div>
            <ul className="space-y-1.5 text-blue-900/90 pl-5 list-disc">
              <li><strong>Increase Following Distance:</strong> Wet tarmac increases bike/car stopping distance by 2.5x. Avoid sudden hard braking on painted road markings and metal manhole covers.</li>
              <li><strong>Waterlogged Underpasses:</strong> Never drive through water levels above your silencer or wheel center. Hydrostatic engine lock will cost ₹15,000+ to repair and platforms do not compensate.</li>
              <li><strong>Platform Delay Evidence:</strong> If heavy rain delays an order, capture a 5-second video of the road blockage immediately. This exempts you from the ₹350 customer cancellation penalty.</li>
            </ul>
          </div>
        ) : (
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <SunMedium className="w-4 h-4 text-amber-600" />
              <span>Extreme Heatwave Health Shield:</span>
            </div>
            <ul className="space-y-1.5 text-amber-900/90 pl-5 list-disc">
              <li><strong>Mandatory ORS/Electrolyte intake:</strong> Pure water is not enough; drink lemon-salt or ORS every 90 minutes to prevent sudden fainting and heat exhaustion while riding.</li>
              <li><strong>Afternoon Throttle (1 PM - 4 PM):</strong> Rest under shade every 45 minutes. The Central Labor Ministry has issued directives asking platforms to restrict high-intensity delivery during peak red heatwave alerts.</li>
              <li><strong>Phone Overheating:</strong> Direct sunlight on phone mounts causes GPS failure and phone shutdowns. Keep a small shade canopy on your phone holder.</li>
            </ul>
          </div>
        )}

      </div>

      {/* On-Duty Accident Checklist & Platform Insurance Claim Guide */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            <span>On-Duty Road Accident: 3-Step Legal & Insurance Checklist</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Most workers fail to claim their ₹2–5 Lakh group accident insurance because they miss the mandatory 24-hour notification window.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Hospital Admission (MLC)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Ensure the government or private hospital registers the case as Medico-Legal Case (MLC). Keep the emergency registration slip safe.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Notify Platform Helpline</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Have a coworker or family member call platform SOS within 24 hours. Quote your active order number or trip ID to lock in shift coverage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Claim Cashless Settlement</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Submit discharge summary, medical bills, and police GD entry copy to the insurer (ICICI Lombard / Digit / TATA AIG) for full settlement.
            </p>
          </div>

        </div>

        {/* Emergency Helplines Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-rose-700">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Emergency: <strong>112</strong></span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <Ambulance className="w-3.5 h-3.5" />
              <span>Free Ambulance: <strong>108</strong></span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span>National Labor Helpline: <strong>14434</strong></span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
