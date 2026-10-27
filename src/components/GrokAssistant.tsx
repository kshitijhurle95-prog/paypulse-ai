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
} from 'lucide-react';

const QUICK_PROMPTS = [
  {
    icon: <Search className="w-3.5 h-3.5 text-paypal-blue" />,
    label: 'Show unpaid & overdue bills',
    text: 'Show me everyone who has not paid their bill from last month',
  },
  {
    icon: <TrendingDown className="w-3.5 h-3.5 text-fintech-rose" />,
    label: 'Why did profits drop this week?',
    text: 'Why did I make less money this week? Break down my cashflow leaks',
  },
  {
    icon: <FilePlus className="w-3.5 h-3.5 text-paypal-sky" />,
    label: 'Bill sarah@test.com $75 for Cupcakes',
    text: 'Bill sarah@test.com $75 for 3 Boxes of Cupcakes',
  },
  {
    icon: <Percent className="w-3.5 h-3.5 text-amber-600" />,
    label: '10% Discount reminder to overdue',
    text: 'Who is overdue on their bills? Send them a payment reminder with a 10% discount if they pay today',
  },
  {
    icon: <Undo2 className="w-3.5 h-3.5 text-purple-600" />,
    label: 'Refund $15 to Sam for broken mug',
    text: 'Refund $15 to Sam for the broken mug',
  },
];

export default function GrokAssistant() {
  const { chatMessages, sendMessage, isAiThinking } = useStore();
  const [inputText, setInputText] = useState('');
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

  return (
    <div className="flex flex-col h-full bg-white border-r border-app-border">
      {/* Copilot Header */}
      <div className="p-4 border-b border-app-border flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-paypal-blue text-white flex items-center justify-center shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-fintech-text flex items-center gap-1.5">
              <span>Grok Financial Copilot</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live
              </span>
            </h2>
            <p className="text-[11px] text-fintech-muted">Zero-Dashboard Natural Language Controller</p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
          xAI Grok + PayPal
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender Badge */}
            <div className="flex items-center space-x-1.5 mb-1 px-1">
              {msg.sender === 'user' ? (
                <>
                  <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                  <span className="text-xs font-semibold text-slate-700">You (Merchant)</span>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </>
              ) : msg.sender === 'grok' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-paypal-blue" />
                  <span className="text-xs font-semibold text-slate-900">Grok AI Copilot</span>
                  <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-paypal-sky" />
                  <span className="text-xs font-semibold text-slate-700">PayPulse System</span>
                  <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                </>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[94%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-paypal-blue text-white rounded-tr-none'
                  : msg.sender === 'system'
                  ? 'bg-slate-100 text-slate-800 border border-slate-200'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Dynamic Grid Action Notice */}
              {msg.gridAction && msg.gridAction.explanation && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-medium text-paypal-blue">
                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                  <span>Workbench Updated: {msg.gridAction.explanation}</span>
                </div>
              )}

              {/* Interactive Approval Card */}
              {msg.pendingAction && (
                <ApprovalCard action={msg.pendingAction} />
              )}
            </div>
          </div>
        ))}

        {/* AI Thinking Animation */}
        {isAiThinking && (
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center space-x-1.5 px-1">
              <Bot className="w-3.5 h-3.5 text-paypal-blue animate-bounce" />
              <span className="text-xs font-semibold text-slate-700">Grok AI</span>
              <span className="text-[11px] text-slate-400">reasoning...</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center space-x-2 text-slate-600 shadow-sm">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-paypal-blue" />
              <span>Analyzing financial store data & preparing PayPal actions...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips (Tailored for Judges) */}
      <div className="p-3 border-t border-app-border bg-slate-50/70">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
          <span>Judge Demo Quick-Prompts (5 Scenarios)</span>
          <span className="text-[9px] text-paypal-blue font-medium">Click to test</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt.text)}
              disabled={isAiThinking}
              className="flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 px-2.5 py-1.5 rounded-lg text-[11px] font-medium shadow-fintech transition-all disabled:opacity-50"
            >
              {prompt.icon}
              <span>{prompt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-app-border bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Talk to your money... (e.g. 'Bill sarah@test.com $75' or 'Who is overdue?')"
            disabled={isAiThinking}
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-paypal-blue rounded-xl pl-3.5 pr-11 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-inner focus:shadow-md"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isAiThinking}
            className="absolute right-1.5 p-2 bg-paypal-blue hover:bg-paypal-dark text-white rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-paypal-blue shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>Press Enter to chat</span>
          <span className="text-paypal-blue font-medium">Controls AG Grid & PayPal in real time</span>
        </div>
      </form>
    </div>
  );
}
