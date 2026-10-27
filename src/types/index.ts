export type TransactionType = 'INVOICE' | 'DIRECT_PAYMENT' | 'REFUND';

export type PaymentStatus = 
  | 'PAID' 
  | 'SENT' 
  | 'OVERDUE' 
  | 'REFUNDED' 
  | 'REMINDER SENT (10% OFF)';

export interface Transaction {
  id: string;               // e.g. "INV2-9842-1001" or "TX-88219"
  date: string;             // ISO string "2026-10-24"
  customerName: string;
  customerEmail: string;
  description: string;
  type: TransactionType;
  amount: number;
  currency: 'USD';
  status: PaymentStatus;
  paypalUrl: string;
  items?: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes?: string;
  isOverdue?: boolean;
  dueDate?: string;
  discountApplied?: number; // e.g. 10
}

export interface GrokGridAction {
  statusFilter?: PaymentStatus[];
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
  highlightIds?: string[];
  clearFilter?: boolean;
  explanation?: string;
}

export type ActionType = 
  | 'CREATE_INVOICE' 
  | 'BULK_INVOICE' 
  | 'OVERDUE_DISCOUNT_REMINDER' 
  | 'ISSUE_REFUND';

export interface PendingPayPalAction {
  id: string;
  actionType: ActionType;
  title: string;
  subtitle: string;
  items: Array<{ label: string; value: string }>;
  totalAmount: number;
  payload: {
    customerName?: string;
    customerEmail?: string;
    recipients?: Array<{ name: string; email: string; amount: number; item: string }>;
    description?: string;
    amount?: number;
    targetInvoiceIds?: string[];
    targetTransactionId?: string;
    refundAmount?: number;
    discountPercent?: number;
    notes?: string;
  };
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'EXECUTED';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'grok' | 'system';
  text: string;
  timestamp: string;
  pendingAction?: PendingPayPalAction;
  gridAction?: GrokGridAction;
  isStreaming?: boolean;
}

export interface ApiLog {
  id: string;
  timestamp: string;
  service: 'PayPal Sandbox' | 'xAI Grok' | 'Zapier Webhook';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: number;
  request: any;
  response: any;
  durationMs?: number;
}

export interface StoreMetrics {
  totalRevenue: number;
  paidCount: number;
  overdueRevenue: number;
  overdueCount: number;
  totalRefunded: number;
  refundCount: number;
  refundRate: number;
}
