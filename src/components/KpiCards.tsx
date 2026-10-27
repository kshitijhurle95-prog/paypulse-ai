'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import {
  TrendingUp,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export default function KpiCards() {
  const { metrics, sendMessage, isAiThinking } = useStore();

  const handleRecoverOverdue = () => {
    if (isAiThinking) return;
    sendMessage('Who is overdue on their bills? Send them a payment reminder with a 10% discount if they pay today');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      {/* KPI 1: Total Revenue Collected */}
      <div className="bg-white border border-app-border rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-emerald-100 transition-colors" />
        <div className="flex items-center justify-between relative z-10 mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Revenue Collected
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              ${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>{metrics.paidCount} paid transactions</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            Confirmed
          </span>
        </div>
      </div>

      {/* KPI 2: Waiting to Be Paid / Overdue */}
      <div className="bg-white border border-app-border rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-rose-300 transition-colors">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-rose-100 transition-colors" />
        <div className="flex items-center justify-between relative z-10 mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Waiting to Be Paid / Overdue
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold text-rose-600 tracking-tight">
              ${metrics.overdueRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
              <ShieldAlert className="w-3 h-3" />
              <span>{metrics.overdueCount} overdue invoices</span>
            </div>
          </div>
          <button
            onClick={handleRecoverOverdue}
            disabled={isAiThinking || metrics.overdueCount === 0}
            className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            title="Trigger Grok AI Overdue Recovery with 10% discount"
          >
            <Sparkles className="w-3 h-3" />
            <span>Recover (AI)</span>
          </button>
        </div>
      </div>

      {/* KPI 3: Total Refunded */}
      <div className="bg-white border border-app-border rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-colors">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-amber-100 transition-colors" />
        <div className="flex items-center justify-between relative z-10 mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Refunded
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <RotateCcw className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              ${metrics.totalRefunded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1 mt-1">
              <span>{metrics.refundCount} orders refunded</span>
              <span>·</span>
              <span>{metrics.refundRate.toFixed(1)}% rate</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
            Profit Leak
          </span>
        </div>
      </div>
    </div>
  );
}
