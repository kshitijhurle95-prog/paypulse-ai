'use client';

import React from 'react';
import Header from '@/components/Header';
import GrokAssistant from '@/components/GrokAssistant';
import FinancialWorkbench from '@/components/FinancialWorkbench';
import ApiInspectorDrawer from '@/components/ApiInspectorDrawer';

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#090D16] transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column (35% Width): Conversational Grok AI Copilot */}
        <section className="w-full lg:w-[35%] lg:min-w-[360px] lg:max-w-[500px] h-1/2 lg:h-full flex-shrink-0 flex flex-col">
          <GrokAssistant />
        </section>

        {/* Right Column (65% Width): Live Interactive AG Grid Workbench */}
        <section className="w-full lg:w-[65%] flex-1 h-1/2 lg:h-full flex flex-col overflow-hidden">
          <FinancialWorkbench />
        </section>
      </main>

      {/* Real-time API Logs Inspector Drawer (Bottom) */}
      <ApiInspectorDrawer />
    </div>
  );
}
