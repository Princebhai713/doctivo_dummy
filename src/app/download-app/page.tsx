
'use client';

import { Smartphone, ShieldCheck, Zap, BellRing, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Landing Page Barrier for standard web browsers.
 * Served when a Patient attempts to access the platform via Chrome/Safari.
 */
export default function DownloadAppPage() {
  return (
    <div className="mobile-container bg-slate-900 text-white min-h-screen flex flex-col p-8 pt-20 overflow-y-auto">
      <div className="flex-1 flex flex-col items-center text-center space-y-12">
        {/* Brand Identity */}
        <div className="space-y-4">
          <div className="h-20 w-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-blue-600/30">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight leading-tight">
            Doctivo Mobile App <br /> 
            <span className="text-blue-500">Available Now!</span>
          </h1>
        </div>

        {/* Value Proposition */}
        <div className="w-full space-y-6">
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            For secure advance payments, live queue tracking, and real-time clinic notifications, please use our official smartphone application.
          </p>

          <div className="grid grid-cols-1 gap-4 text-left">
            {[
              { icon: ShieldCheck, title: "Secure Payments", desc: "UPI & Card transactions verified by app." },
              { icon: Zap, title: "Live Queue", desc: "Track your token number in real-time." },
              { icon: BellRing, title: "Instant Alerts", desc: "Get notified when your turn is close." }
            ].map((feature, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700/50 rounded-2xl border">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                    <feature.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{feature.title}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{feature.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pb-10 pt-12 space-y-6">
        <Button 
          className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group"
          onClick={() => window.open('https://play.google.com/store', '_blank')}
        >
          Download on Play Store
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        <p className="text-[10px] text-center text-slate-500 font-black uppercase tracking-[0.2em]">
          Optimized for Android & iOS
        </p>
      </div>
    </div>
  );
}
