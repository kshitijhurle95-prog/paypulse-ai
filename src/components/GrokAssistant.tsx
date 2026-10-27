'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import ApprovalCard from './ApprovalCard';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  TrendingDown,
  FilePlus,
  Percent,
  Search,
  Undo2,
  Paperclip,
  Globe,
  Mic,
  Maximize2,
  FileText,
  Trash2,
  Clock,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

const QUICK_PROMPTS = [
  {
    icon: <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    label: 'Show unpaid bills from last week',
    text: 'Show me everyone who has not paid their bill from last month',
  },
  {
    icon: <FilePlus className="w-4 h-4 text-sky-500" />,
    label: 'Bill sarah@test.com $75 for cupcakes',
    text: 'Bill sarah@test.com $75 for 3 Boxes of Cupcakes',
  },
  {
    icon: <TrendingDown className="w-4 h-4 text-rose-500" />,
    label: 'Why did profits drop this week?',
    text: 'Why did I make less money this week? Break down my cashflow leaks',
  },
  {
    icon: <Percent className="w-4 h-4 text-amber-500" />,
    label: 'Give 10% discount to overdue invoices',
    text: 'Who is overdue on their bills? Send them a payment reminder with a 10% discount if they pay today',
  },
  {
    icon: <Undo2 className="w-4 h-4 text-purple-500" />,
    label: 'Refund $15 to Sam for broken mug',
    text: 'Refund $15 to Sam for the broken mug',
  },
];

const ALTERNATE_PROMPTS = [
  {
    icon: <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    label: 'Find all transactions over $100',
    text: 'Show all orders and invoices greater than $100',
  },
  {
    icon: <FilePlus className="w-4 h-4 text-sky-500" />,
    label: 'Send bulk bills for corporate brunch',
    text: 'Send $40 invoices to priya@innovate.co and rahul@fintechlab.com for weekly croissant deliveries',
  },
  {
    icon: <TrendingDown className="w-4 h-4 text-rose-500" />,
    label: 'Explain refund spike on Tuesday',
    text: 'Why are there so many refunded cake orders? Analyze customer reasons',
  },
];

export default function GrokAssistant() {
  const { chatMessages, sendMessage, isAiThinking, clearChat } = useStore();
  const [inputText, setInputText] = useState('');
  const [showMoreExamples, setShowMoreExamples] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiThinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAiThinking) return;
    const text = inputText;
    setInputText('');
    await sendMessage(text);
  };

  const handleQuickPrompt = async (promptText: string) => {
    if (isAiThinking) return;
    await sendMessage(promptText);
  };

  const promptsToDisplay = showMoreExamples ? ALTERNATE_PROMPTS : QUICK_PROMPTS;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Copilot Header Card */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
        <div className="flex items-center space-x-3">
          {/* Avatar with blue glow headset/bot */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Grok Financial Copilot
              </h2>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Your AI store manager for SweetCrumb Artisan Bakery
            </p>
          </div>
        </div>

        {/* Window action icons */}
        <div className="flex items-center space-x-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <button
            onClick={() => alert("PayPulse Copilot context is active and synced with SweetCrumb Bakery store records.")}
            title="Copilot Details"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert("Copilot full workbench view is active.")}
            title="Expand View"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={clearChat}
            title="Clear conversation"
            className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Message Feed & Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Sender Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-slate-800 dark:bg-slate-700 text-white'
                  : msg.sender === 'grok'
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Bubble Content */}
            <div className={`max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : msg.sender === 'system'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    : 'bg-slate-50 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                }`}
              >
                {/* Special bold title for welcome message to match image 2 */}
                {msg.id.includes('welcome') && (
                  <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Hi! I'm your PayPulse AI copilot.
                  </div>
                )}
                <div>{msg.text}</div>

                {/* Human-in-the-Loop Action Approval Card */}
                {msg.pendingAction && (
                  <div className="mt-3">
                    <ApprovalCard action={msg.pendingAction} />
                  </div>
                )}
              </div>

              <div
                className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* AI Thinking Indicator */}
        {isAiThinking && (
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
              <span>Grok AI is analyzing store finances & PayPal records...</span>
            </div>
          </div>
        )}

        {/* Quick-Prompt Chips (Vertical stacked pills with icons matching Image 2) */}
        <div className="pt-2 pb-1 space-y-2">
          {promptsToDisplay.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(p.text)}
              disabled={isAiThinking}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left group"
            >
              <div className="flex-shrink-0">{p.icon}</div>
              <span className="truncate flex-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {p.label}
              </span>
            </button>
          ))}

          {/* See more examples link */}
          <button
            onClick={() => setShowMoreExamples(!showMoreExamples)}
            className="flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 pt-1 px-1 transition-colors"
          >
            <span>{showMoreExamples ? 'Show previous examples' : 'See more examples'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Actions Grid (4 Cards in a row matching Image 2) */}
        <div className="pt-3 pb-1 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Quick Actions</h3>
            <button
              onClick={() => handleQuickPrompt('List all available PayPal and financial actions I can perform')}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {/* 1. Create Invoice */}
            <button
              onClick={() => handleQuickPrompt('Bill sarah@test.com $75 for 3 Boxes of Cupcakes')}
              disabled={isAiThinking}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-200 text-center transition-all group shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <FilePlus className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold leading-tight line-clamp-1">Create Invoice</span>
            </button>

            {/* 2. Find Overdue */}
            <button
              onClick={() => handleQuickPrompt('Show me everyone who has not paid their bill')}
              disabled={isAiThinking}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-amber-300 dark:hover:border-amber-700 text-slate-700 dark:text-slate-200 text-center transition-all group shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold leading-tight line-clamp-1">Find Overdue</span>
            </button>

            {/* 3. Issue Refund */}
            <button
              onClick={() => handleQuickPrompt('Refund $15 to Sam for the broken mug')}
              disabled={isAiThinking}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-rose-300 dark:hover:border-rose-700 text-slate-700 dark:text-slate-200 text-center transition-all group shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Undo2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold leading-tight line-clamp-1">Issue Refund</span>
            </button>

            {/* 4. Apply Discount */}
            <button
              onClick={() => handleQuickPrompt('Who is overdue on their bills? Send them a payment reminder with a 10% discount if they pay today')}
              disabled={isAiThinking}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-purple-300 dark:hover:border-purple-700 text-slate-700 dark:text-slate-200 text-center transition-all group shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Percent className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold leading-tight line-clamp-1">Apply Discount</span>
            </button>
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Container matching Image 2 */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Main Input Box with Blue Send Button */}
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all p-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder='Talk to your money... (e.g. "Bill sarah@test.com $75")'
              disabled={isAiThinking}
              className="w-full bg-transparent px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isAiThinking}
              className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm disabled:opacity-40 transition-colors flex-shrink-0 mr-1"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Bar: Action Icons + Model Badge */}
          <div className="flex items-center justify-between px-1 text-slate-400 dark:text-slate-500">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => alert("Attachment feature ready for receipts and bank statements.")}
                title="Attach document or receipt"
                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => alert("Live PayPal Sandbox live sync enabled.")}
                title="Online Sandbox sync"
                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => alert("Voice dictation ready: try asking 'Show overdue invoices'")}
                title="Voice dictation"
                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Model Pill */}
            <div className="flex items-center space-x-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
              <span>Grok + PayPal</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
