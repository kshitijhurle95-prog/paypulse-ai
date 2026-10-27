'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import {
  Sparkles,
  RefreshCw,
  Terminal,
  ShieldCheck,
  CreditCard,
  Store,
} from 'lucide-react';

export default function Header() {
  const { resetToJudgeDemoData, toggleInspector, isInspectorOpen, apiLogs } = useStore();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-app-border shadow-sm">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-paypal-blue to-paypal-sky flex items-center justify-center text-white shadow-md shadow-paypal-blue/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-fintech-text tracking-tight">
                PayPulse <span className="text-paypal-blue">AI</span>
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-paypal-light text-paypal-blue px-2 py-0.5 rounded-full border border-sky-200">
                Talk-to-Your-Money
              </span>
            </div>
            <p className="text-xs text-fintech-muted flex items-center gap-1.5">
              <span>Conversational Store Manager for</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <Store className="w-3 h-3 text-paypal-blue" />
                SweetCrumb Artisan Bakery
              </span>
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="hidden lg:flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1.5 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Grok AI Ready</span>
          </div>

          <div className="flex items-center space-x-2 bg-sky-50 text-sky-800 border border-sky-200 text-xs px-3 py-1.5 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-paypal-blue" />
            <span>PayPal Sandbox Active</span>
          </div>
        </div>

        {/* Action Buttons: Judge Demo Mode & API Inspector */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 1-Click Judge Demo Mode */}
          <button
            onClick={resetToJudgeDemoData}
            title="Reset store to 25 realistic transactions for testing"
            className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all duration-150"
          >
            <RefreshCw className="w-3.5 h-3.5 text-paypal-blue" />
            <span className="hidden sm:inline">Load Demo Bakery Data</span>
            <span className="sm:hidden">Reset</span>
          </button>

          {/* API Inspector Drawer Toggle */}
          <button
            onClick={toggleInspector}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-sm transition-all duration-150 ${
              isInspectorOpen
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-paypal-sky" />
            <span>API Inspector</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isInspectorOpen
                  ? 'bg-paypal-blue text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {apiLogs.length}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
