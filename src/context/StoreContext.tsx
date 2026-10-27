'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Transaction,
  ChatMessage,
  GrokGridAction,
  PendingPayPalAction,
  ApiLog,
  StoreMetrics,
} from '@/types';
import { INITIAL_TRANSACTIONS } from '@/lib/seed-data';
import confetti from 'canvas-confetti';

interface StoreContextType {
  transactions: Transaction[];
  chatMessages: ChatMessage[];
  activeFilter: GrokGridAction | null;
  highlightedIds: string[];
  apiLogs: ApiLog[];
  isInspectorOpen: boolean;
  isAiThinking: boolean;
  metrics: StoreMetrics;
  sendMessage: (text: string) => Promise<void>;
  approveAction: (action: PendingPayPalAction) => Promise<void>;
  cancelAction: (actionId: string) => void;
  clearFilter: () => void;
  resetToJudgeDemoData: () => void;
  toggleInspector: () => void;
  setIsInspectorOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activeFilter, setActiveFilter] = useState<GrokGridAction | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([
    {
      id: 'init_log_1',
      timestamp: new Date().toLocaleTimeString(),
      service: 'PayPal Sandbox',
      endpoint: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      method: 'POST',
      status: 200,
      durationMs: 110,
      request: { grant_type: 'client_credentials', environment: 'SANDBOX' },
      response: {
        scope: 'https://api.paypal.com/v1/payments/.* https://uri.paypal.com/services/invoicing',
        access_token: 'A21AA...sandbox_token_active',
        token_type: 'Bearer',
        app_id: 'APP-80W284485P519543T',
        expires_in: 32400,
      },
    },
    {
      id: 'init_log_2',
      timestamp: new Date().toLocaleTimeString(),
      service: 'xAI Grok',
      endpoint: 'https://api.x.ai/v1/models',
      method: 'GET',
      status: 200,
      durationMs: 85,
      request: { model: 'grok-4.7' },
      response: { id: 'grok-4.7', object: 'model', owned_by: 'xai', ready: true },
    },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'grok',
      timestamp: 'Just now',
      text: "👋 Hi! I'm your PayPulse AI store copilot for SweetCrumb Artisan Bakery. Talk to your money naturally: ask me to show unpaid bills, create instant PayPal invoices, chase late payers with discounts, or explain why profits dropped this week!",
    },
  ]);

  // Compute live KPI metrics
  const metrics: StoreMetrics = React.useMemo(() => {
    let totalRevenue = 0;
    let paidCount = 0;
    let overdueRevenue = 0;
    let overdueCount = 0;
    let totalRefunded = 0;
    let refundCount = 0;

    transactions.forEach((t) => {
      if (t.status === 'PAID') {
        totalRevenue += t.amount;
        paidCount++;
      } else if (t.status === 'OVERDUE') {
        overdueRevenue += t.amount;
        overdueCount++;
      } else if (t.status === 'REFUNDED') {
        totalRefunded += t.amount;
        refundCount++;
      }
    });

    const refundRate = transactions.length > 0 ? (refundCount / transactions.length) * 100 : 0;

    return {
      totalRevenue,
      paidCount,
      overdueRevenue,
      overdueCount,
      totalRefunded,
      refundCount,
      refundRate,
    };
  }, [transactions]);

  // Send message to Grok AI
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: [...chatMessages, userMsg],
          transactions,
        }),
      });

      const data = await res.json();

      if (data.log) {
        setApiLogs((prev) => [data.log, ...prev]);
      }

      // Handle Grid Actions
      if (data.gridAction) {
        if (data.gridAction.clearFilter) {
          setActiveFilter(null);
          setHighlightedIds([]);
        } else {
          setActiveFilter(data.gridAction);
          if (data.gridAction.highlightIds) {
            setHighlightedIds(data.gridAction.highlightIds);
          }
        }
      }

      const grokMsg: ChatMessage = {
        id: `grok_${Date.now()}`,
        sender: 'grok',
        text: data.reply || 'Financial analysis updated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pendingAction: data.pendingPayPalAction,
        gridAction: data.gridAction,
      };

      setChatMessages((prev) => [...prev, grokMsg]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'system',
          text: `⚠️ Request failed: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Approve a Pending PayPal Action
  const approveAction = async (action: PendingPayPalAction) => {
    setIsAiThinking(true);
    try {
      const res = await fetch('/api/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: action.actionType,
          payload: action.payload,
        }),
      });

      const data = await res.json();

      if (data.logs && Array.isArray(data.logs)) {
        setApiLogs((prev) => [...data.logs, ...prev]);
      }

      // Update local transaction state based on action type
      if (action.actionType === 'CREATE_INVOICE' || action.actionType === 'BULK_INVOICE') {
        if (data.newTransactions && data.newTransactions.length > 0) {
          setTransactions((prev) => [...data.newTransactions, ...prev]);
          setHighlightedIds(data.newTransactions.map((t: Transaction) => t.id));
        }
      } else if (action.actionType === 'OVERDUE_DISCOUNT_REMINDER') {
        const targetIds = action.payload.targetInvoiceIds || [];
        setTransactions((prev) =>
          prev.map((t) =>
            targetIds.includes(t.id)
              ? { ...t, status: 'REMINDER SENT (10% OFF)', discountApplied: 10 }
              : t
          )
        );
        setHighlightedIds(targetIds);
      } else if (action.actionType === 'ISSUE_REFUND') {
        const txId = action.payload.targetTransactionId;
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === txId
              ? {
                  ...t,
                  status: 'REFUNDED',
                  notes: `${t.notes || ''} [Partial refund $${action.payload.refundAmount} issued via PayPal Sandbox]`,
                }
              : t
          )
        );
        if (txId) setHighlightedIds([txId]);
      }

      // Mark the action approved in message history
      setChatMessages((prev) =>
        prev.map((m) =>
          m.pendingAction && m.pendingAction.id === action.id
            ? {
                ...m,
                pendingAction: { ...m.pendingAction, status: 'EXECUTED' },
              }
            : m
        )
      );

      // Trigger festive celebration confetti for successful PayPal transaction
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0070BA', '#009CDE', '#10B981', '#F59E0B'],
      });

      // Post AI confirmation in chat
      setChatMessages((prev) => [
        ...prev,
        {
          id: `sys_${Date.now()}`,
          sender: 'system',
          text: `✅ ${data.message || 'PayPal action executed successfully.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      alert(`Error executing PayPal action: ${err.message}`);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Cancel action
  const cancelAction = (actionId: string) => {
    setChatMessages((prev) =>
      prev.map((m) =>
        m.pendingAction && m.pendingAction.id === actionId
          ? {
              ...m,
              pendingAction: { ...m.pendingAction, status: 'CANCELLED' },
            }
            : m
      )
    );
  };

  const clearFilter = () => {
    setActiveFilter(null);
    setHighlightedIds([]);
  };

  const resetToJudgeDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setActiveFilter(null);
    setHighlightedIds([]);
    setChatMessages([
      {
        id: `reset_${Date.now()}`,
        sender: 'system',
        text: '🔄 SweetCrumb Artisan Bakery store data reset to 25 pristine transactions and invoices for Judge Demo Mode.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const toggleInspector = () => setIsInspectorOpen((prev) => !prev);

  return (
    <StoreContext.Provider
      value={{
        transactions,
        chatMessages,
        activeFilter,
        highlightedIds,
        apiLogs,
        isInspectorOpen,
        isAiThinking,
        metrics,
        sendMessage,
        approveAction,
        cancelAction,
        clearFilter,
        resetToJudgeDemoData,
        toggleInspector,
        setIsInspectorOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
