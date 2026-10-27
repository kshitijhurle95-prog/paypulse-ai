'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import {
  Sparkles,
  RefreshCw,
  Terminal,
  ShieldCheck,
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Bot,
  Sun,
  Moon,
  PanelLeftOpen,
} from 'lucide-react';

export default function Header() {
  const {
    resetToJudgeDemoData,
    toggleInspector,
    isInspectorOpen,
    apiLogs,
    theme,
    toggleTheme,
    activeNavTab,
    setActiveNavTab,
    isChatOpen,
    setIsChatOpen,
    toggleChat,
  } = useStore();

  const handleNavClick = (tab: 'dashboard' | 'invoices' | 'customers' | 'analytics' | 'ai') => {
    if (tab === 'ai') {
      setIsChatOpen((prev) => !prev);
    } else {
      setActiveNavTab(tab);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left Side: Brand Logo + Subtitle + Main Navigation Tabs */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Logo & Subtitle */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                PayPulse <span className="text-blue-600 dark:text-blue-400">AI</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-tight mt-0.5">
                Talk-to-Your-Money
              </p>
            </div>
          </div>

          {/* Quick Toggle for Collapsed Copilot */}
          {!isChatOpen && (
            <button
              onClick={toggleChat}
              title="Expand AI Copilot"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:bg-blue-100 transition-all animate-in fade-in"
            >
              <PanelLeftOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open Copilot</span>
            </button>
          )}

          {/* Navigation Pill Tabs - Now 100% Functional! */}
          <nav className="hidden md:flex items-center space-x-1 pl-2">
            {/* 1. Dashboard */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                activeNavTab === 'dashboard'
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            {/* 2. Invoices */}
            <button
              onClick={() => handleNavClick('invoices')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                activeNavTab === 'invoices'
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Invoices</span>
            </button>

            {/* 3. Customers */}
            <button
              onClick={() => handleNavClick('customers')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                activeNavTab === 'customers'
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customers</span>
            </button>

            {/* 4. Analytics */}
            <button
              onClick={() => handleNavClick('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                activeNavTab === 'analytics'
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            {/* 5. AI Assistant */}
            <button
              onClick={() => handleNavClick('ai')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                isChatOpen
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-blue-500" />
              <span>AI Assistant</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isChatOpen ? 'bg-blue-600' : 'bg-slate-300'}`} />
            </button>
          </nav>
        </div>

        {/* Right Side: Status Badges + Demo Reset + Theme Toggle + User Avatar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Status Badges */}
          <div className="hidden xl:flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs px-2.5 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>PayPal Sandbox Active</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Grok AI Ready</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs px-2.5 py-1 rounded-full font-medium">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>AG Studio Enterprise</span>
            </div>
          </div>

          {/* Load Demo Bakery Data Button (Dynamic Seed on Every Click!) */}
          <button
            onClick={resetToJudgeDemoData}
            title="Generate & load fresh randomized bakery data"
            className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Load Demo Bakery Data</span>
          </button>

          {/* API Inspector Drawer Toggle */}
          <button
            onClick={toggleInspector}
            title="Inspect real-time API logs"
            className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-sm transition-all ${
              isInspectorOpen
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-blue-600 dark:border-blue-600'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-sky-500" />
            <span>API Inspector</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {apiLogs.length}
            </span>
          </button>

          {/* Theme Toggle Button (Light Mode / Dark Mode) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in fade-in zoom-in" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 animate-in fade-in zoom-in" />
            )}
          </button>

          {/* User Profile Avatar with Initials "KS" and Green Online Status */}
          <div className="relative cursor-pointer group" title="Kshitij Hurle (Merchant)">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              KS
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0F172A] absolute -bottom-0.5 -right-0.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
