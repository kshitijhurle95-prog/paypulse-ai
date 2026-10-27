'use client';

import React from 'react';
import { PendingPayPalAction } from '@/types';
import { useStore } from '@/context/StoreContext';
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
        return <FileText className="w-4 h-4 text-paypal-blue" />;
      case 'OVERDUE_DISCOUNT_REMINDER':
        return <Percent className="w-4 h-4 text-fintech-rose" />;
      case 'ISSUE_REFUND':
        return <RotateCcw className="w-4 h-4 text-fintech-amber" />;
    }
  };

  const getBadgeColor = () => {
    switch (action.actionType) {
      case 'CREATE_INVOICE':
      case 'BULK_INVOICE':
        return 'bg-blue-50 text-paypal-blue border-blue-200';
      case 'OVERDUE_DISCOUNT_REMINDER':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ISSUE_REFUND':
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="mt-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            {getActionIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getBadgeColor()}`}>
                Human-in-the-Loop Approval
              </span>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-paypal-blue" />
                PayPal Sandbox
              </span>
            </div>
            <h4 className="text-xs font-semibold text-slate-900 mt-1">{action.title}</h4>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="py-3 space-y-1.5 text-xs">
        {action.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-0.5">
            <span className="text-slate-500">{item.label}</span>
            <span className="font-medium text-slate-900 text-right">{item.value}</span>
          </div>
        ))}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700">Total PayPal Value</span>
          <span className="text-paypal-blue text-sm">${action.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2">
        {action.status === 'PENDING' ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => approveAction(action)}
              disabled={isAiThinking}
              className="flex-1 flex items-center justify-center space-x-1.5 bg-paypal-blue hover:bg-paypal-dark text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors duration-150 disabled:opacity-50"
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
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : action.status === 'EXECUTED' ? (
          <div className="flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-700 border border-emerald-200 py-2 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Executed on PayPal Sandbox & Table Updated</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 bg-slate-50 text-slate-500 border border-slate-200 py-2 rounded-lg text-xs font-medium">
            <XCircle className="w-4 h-4 text-slate-400" />
            <span>Action Cancelled by User</span>
          </div>
        )}
      </div>
    </div>
  );
}
