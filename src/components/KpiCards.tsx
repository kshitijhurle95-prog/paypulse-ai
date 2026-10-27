'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  BarChart3,
  Clock,
  RotateCcw,
  Users,
  ArrowUpRight,
} from 'lucide-react';

export default function KpiCards() {
  const { metrics } = useStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
      {/* 1. Total Revenue Collected */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between transition-colors">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block tracking-tight">
              Total Revenue Collected
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              ${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <span>↗</span>
              <span>+12.5% from last week</span>
            </div>
          </div>
        </div>

        {/* Blue Sparkline Wave */}
        <div className="w-16 h-8 flex-shrink-0">
          <svg viewBox="0 0 70 30" className="w-full h-full stroke-blue-500 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 2 24 Q 15 10 30 18 T 55 8 T 68 5" />
          </svg>
        </div>
      </div>

      {/* 2. Pending / Overdue */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between transition-colors">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-rose-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block tracking-tight">
              Pending / Overdue
            </span>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400 tracking-tight mt-0.5">
              ${metrics.overdueRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-rose-500 dark:text-rose-400 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>{metrics.overdueCount} overdue invoices</span>
            </div>
          </div>
        </div>

        {/* Rose Sparkline Wave */}
        <div className="w-16 h-8 flex-shrink-0">
          <svg viewBox="0 0 70 30" className="w-full h-full stroke-rose-500 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 2 22 Q 18 28 35 15 T 52 20 T 68 8" />
          </svg>
        </div>
      </div>

      {/* 3. Total Refunded */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between transition-colors">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-500/20">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block tracking-tight">
              Total Refunded
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              ${metrics.totalRefunded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <span>{metrics.refundCount} orders refunded · {metrics.refundRate.toFixed(1)}% rate</span>
            </div>
          </div>
        </div>

        {/* Emerald Sparkline Wave */}
        <div className="w-16 h-8 flex-shrink-0">
          <svg viewBox="0 0 70 30" className="w-full h-full stroke-emerald-500 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 2 20 Q 20 25 38 10 T 55 16 T 68 6" />
          </svg>
        </div>
      </div>

      {/* 4. Total Customers */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between transition-colors">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-purple-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block tracking-tight">
              Total Customers
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              {metrics.totalCustomers}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <span>↑</span>
              <span>3 new this week</span>
            </div>
          </div>
        </div>

        {/* Purple Sparkline Wave */}
        <div className="w-16 h-8 flex-shrink-0">
          <svg viewBox="0 0 70 30" className="w-full h-full stroke-purple-500 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 2 25 Q 16 12 32 20 T 54 9 T 68 4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
