'use client';

import React from 'react';
import Header from '@/components/Header';
import GrokAssistant from '@/components/GrokAssistant';
import FinancialWorkbench from '@/components/FinancialWorkbench';
import ApiInspectorDrawer from '@/components/ApiInspectorDrawer';
import { useStore } from '@/context/StoreContext';
import { Bot, PanelLeftOpen } from 'lucide-react';

export default function Home() {
  const { isChatOpen, toggleChat } = useStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#090D16] transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Column: Conversational Grok AI Copilot (Collapsible!) */}
        <section
          className={`h-full flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${
            isChatOpen
              ? 'w-full lg:w-[360px] xl:w-[420px] 2xl:w-[460px] opacity-100'
              : 'w-0 overflow-hidden opacity-0 pointer-events-none'
          }`}
        >
          <GrokAssistant />
        </section>

        {/* Right Column: Live Interactive Workbench (Expands to 100% when Copilot is collapsed) */}
        <section className="flex-1 w-full h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
          <FinancialWorkbench />
        </section>

        {/* Floating Re-open Button when Copilot is collapsed */}
        {!isChatOpen && (
          <button
            onClick={toggleChat}
            title="Open AI Copilot"
            className="fixed bottom-6 left-6 z-40 flex items-center space-x-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-4"
          >
            <Bot className="w-4 h-4" />
            <span>Open AI Copilot</span>
          </button>
        )}
      </main>

      {/* Real-time API Logs Inspector Drawer (Bottom) */}
      <ApiInspectorDrawer />
    </div>
  );
}
