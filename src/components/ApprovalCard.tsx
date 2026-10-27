'use client';

import React from 'react';
import { PendingPayPalAction } from '../types';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  XCircle,
  FileText,
  Percent,
  RotateCcw,
  ShieldCheck,
  Send,
  Loader2,
} from 'lucide-react';

interface ApprovalCardProps {
  action: PendingPayPalAction;
}

export default function ApprovalCard({ action }: ApprovalCardProps) {
  const { approveAction, cancelAction, isAiThinking } = useStore();

  const getActionIcon = () => {
    switch (action.actionType) {
      case 'CREATE_INVOICE':
      case 'BULK_INVOICE':
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'OVERDUE_DISCOUNT_REMINDER':
        return <Percent className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'ISSUE_REFUND':
        return <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getBadgeColor = () => {
    switch (action.actionType) {
      case 'CREATE_INVOICE':
      case 'BULK_INVOICE':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'OVERDUE_DISCOUNT_REMINDER':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'ISSUE_REFUND':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div className="mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg">
            {getActionIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getBadgeColor()}`}>
                Human-in-the-Loop Approval
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                PayPal Sandbox
              </span>
            </div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white mt-1">{action.title}</h4>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="py-3 space-y-1.5 text-xs">
        {action.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-0.5">
            <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
            <span className="font-medium text-slate-900 dark:text-white text-right">{item.value}</span>
          </div>
        ))}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700 dark:text-slate-300">Total PayPal Value</span>
          <span className="text-blue-600 dark:text-blue-400 text-sm">${action.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2">
        {action.status === 'PENDING' ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => approveAction(action)}
              disabled={isAiThinking}
              className="flex-1 flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors duration-150 disabled:opacity-50"
            >
              {isAiThinking ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing on Sandbox...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Approve & Execute via PayPal</span>
                </>
              )}
            </button>
            <button
              onClick={() => cancelAction(action.id)}
              disabled={isAiThinking}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : action.status === 'EXECUTED' ? (
          <div className="flex items-center justify-center space-x-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 py-2 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Executed on PayPal Sandbox & Table Updated</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 py-2 rounded-lg text-xs font-medium">
            <XCircle className="w-4 h-4 text-slate-400" />
            <span>Action Cancelled by User</span>
          </div>
        )}
      </div>
    </div>
  );
}
