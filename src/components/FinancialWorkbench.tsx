'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Transaction, PaymentStatus } from '../types';
import KpiCards from './KpiCards';
import {
  Search,
  Calendar,
  SlidersHorizontal,
  Download,
  ExternalLink,
  Eye,
  Mail,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Sparkles,
  X,
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Send,
  CheckCircle2,
  PieChart,
  ShoppingBag,
} from 'lucide-react';

export default function FinancialWorkbench() {
  const {
    transactions,
    activeFilter,
    highlightedIds,
    clearFilter,
    sendMessage,
    metrics,
    activeNavTab,
    setActiveNavTab,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'ALL' | PaymentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedTransactionModal, setSelectedTransactionModal] = useState<Transaction | null>(null);

  // Tab counts based on current nav context
  const tabCounts = useMemo(() => {
    let base = transactions;
    if (activeNavTab === 'invoices') {
      base = transactions.filter((t) => t.type === 'INVOICE');
    }

    let paid = 0;
    let overdue = 0;
    let refunded = 0;
    base.forEach((t) => {
      if (t.status === 'PAID') paid++;
      else if (t.status === 'OVERDUE') overdue++;
      else if (t.status === 'REFUNDED') refunded++;
    });
    return {
      all: base.length,
      paid,
      overdue,
      refunded,
    };
  }, [transactions, activeNavTab]);

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    let result = [...transactions];

    // Filter by nav tab if Invoices
    if (activeNavTab === 'invoices') {
      result = result.filter((t) => t.type === 'INVOICE');
    }

    // 1. AI Filter constraint
    if (activeFilter) {
      if (activeFilter.statusFilter && activeFilter.statusFilter.length > 0) {
        result = result.filter((t) => activeFilter.statusFilter!.includes(t.status));
      }
      if (activeFilter.minAmount !== undefined) {
        result = result.filter((t) => t.amount >= activeFilter.minAmount!);
      }
      if (activeFilter.maxAmount !== undefined) {
        result = result.filter((t) => t.amount <= activeFilter.maxAmount!);
      }
    }

    // 2. Tab filter
    if (activeTab !== 'ALL') {
      result = result.filter((t) => t.status === activeTab);
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.customerName.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    // 4. Sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortAsc
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      if (typeof aVal === 'number') {
        return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      }
      return 0;
    });

    return result;
  }, [transactions, activeNavTab, activeFilter, activeTab, searchQuery, sortField, sortAsc]);

  // Aggregated Customer Data for the "Customers" tab
  const customerList = useMemo(() => {
    const map = new Map<string, {
      name: string;
      email: string;
      orderCount: number;
      totalSpent: number;
      hasOverdue: boolean;
      overdueAmount: number;
      lastDate: string;
    }>();

    transactions.forEach((t) => {
      const key = t.customerEmail || t.customerName;
      const existing = map.get(key);
      if (existing) {
        existing.orderCount++;
        existing.totalSpent += t.amount;
        if (t.status === 'OVERDUE') {
          existing.hasOverdue = true;
          existing.overdueAmount += t.amount;
        }
        if (t.date > existing.lastDate) {
          existing.lastDate = t.date;
        }
      } else {
        map.set(key, {
          name: t.customerName,
          email: t.customerEmail,
          orderCount: 1,
          totalSpent: t.amount,
          hasOverdue: t.status === 'OVERDUE',
          overdueAmount: t.status === 'OVERDUE' ? t.amount : 0,
          lastDate: t.date,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [transactions]);

  // Analytics Metrics
  const analyticsSummary = useMemo(() => {
    let paidTotal = 0;
    let overdueTotal = 0;
    let refundedTotal = 0;
    transactions.forEach((t) => {
      if (t.status === 'PAID') paidTotal += t.amount;
      else if (t.status === 'OVERDUE') overdueTotal += t.amount;
      else if (t.status === 'REFUNDED') refundedTotal += t.amount;
    });
    const grandTotal = paidTotal + overdueTotal + refundedTotal;
    const aov = transactions.length > 0 ? (paidTotal / (transactions.length || 1)) : 0;
    return {
      paidTotal,
      overdueTotal,
      refundedTotal,
      grandTotal,
      aov,
      collectionEfficiency: grandTotal > 0 ? ((paidTotal / (paidTotal + overdueTotal || 1)) * 100) : 100,
    };
  }, [transactions]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Keep page within bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(paginatedData.map((t) => t.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Invoice / Ref', 'Date', 'Customer Name', 'Customer Email', 'Description', 'Type', 'Amount (USD)', 'Status', 'PayPal URL'];
    const rows = filteredData.map((t) => [
      t.id,
      t.date,
      `"${t.customerName.replace(/"/g, '""')}"`,
      t.customerEmail,
      `"${t.description.replace(/"/g, '""')}"`,
      t.type,
      t.amount.toFixed(2),
      t.status,
      t.paypalUrl,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PayPulse_SweetCrumb_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-5 bg-[#F8FAFC] dark:bg-[#090D16] transition-colors duration-200">
      {/* 1. Top KPI Summary Cards (Adjusted to sit cleanly at top with zero wasted space) */}
      <KpiCards />

      {/* 2. CUSTOMERS VIEW (when "Customers" tab is clicked in header) */}
      {activeNavTab === 'customers' && (
        <div className="space-y-4 animate-in fade-in duration-200 flex-1 flex flex-col">
          {/* Customers Summary Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  SweetCrumb Customer Directory ({customerList.length} Active Clients)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage commercial accounts, catering contacts, and trigger instant PayPal invoices.
                </p>
              </div>
            </div>
            <button
              onClick={() => sendMessage('Who are my highest-spending bakery customers and do any owe money?')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Top Customers (AI)</span>
            </button>
          </div>

          {/* Customers Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Contact Email</th>
                    <th className="py-3 px-4 text-center">Total Orders</th>
                    <th className="py-3 px-4 text-right">Lifetime Spent</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4 text-center">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {customerList.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-[10px] flex items-center justify-center">
                          {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span>{c.name}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {c.email}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {c.orderCount}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                        ${c.totalSpent.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        {c.hasOverdue ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800">
                            ● Overdue (${c.overdueAmount.toFixed(2)})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                            ● Good Standing
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {c.lastDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => sendMessage(`Bill ${c.email} $50 for bakery order`)}
                            title="Bill Customer"
                            className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 hover:bg-blue-100 text-[11px] font-semibold"
                          >
                            Bill (PayPal)
                          </button>
                          <button
                            onClick={() => sendMessage(`Show all transaction history for ${c.name}`)}
                            title="View History"
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ANALYTICS VIEW (when "Analytics" tab is clicked in header) */}
      {activeNavTab === 'analytics' && (
        <div className="space-y-4 animate-in fade-in duration-200 flex-1 flex flex-col">
          {/* Analytics KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Store Volume</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                ${analyticsSummary.grandTotal.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Across 25 transactions this month</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Order Value</span>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                ${analyticsSummary.aov.toFixed(2)}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">↗ +8.2% vs previous month</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Collection Efficiency</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {analyticsSummary.collectionEfficiency.toFixed(1)}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Ratio of collected vs overdue bills</p>
            </div>
          </div>

          {/* Revenue Breakdown Progress Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Revenue Distribution by Status</h3>
              <span className="text-xs font-mono font-semibold text-slate-500">100% of Store Activity</span>
            </div>

            {/* Visual multi-color bar */}
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(analyticsSummary.paidTotal / (analyticsSummary.grandTotal || 1)) * 100}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Paid: $${analyticsSummary.paidTotal.toFixed(2)}`}
              />
              <div
                style={{ width: `${(analyticsSummary.overdueTotal / (analyticsSummary.grandTotal || 1)) * 100}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`Overdue: $${analyticsSummary.overdueTotal.toFixed(2)}`}
              />
              <div
                style={{ width: `${(analyticsSummary.refundedTotal / (analyticsSummary.grandTotal || 1)) * 100}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Refunded: $${analyticsSummary.refundedTotal.toFixed(2)}`}
              />
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Paid (${analyticsSummary.paidTotal.toFixed(2)})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Overdue (${analyticsSummary.overdueTotal.toFixed(2)})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Refunded (${analyticsSummary.refundedTotal.toFixed(2)})
                </span>
              </div>
            </div>
          </div>

          {/* Quick AI Diagnostic Box */}
          <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Grok AI Cashflow Diagnosis
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Your store has <strong>{metrics.overdueCount} overdue invoices</strong> totaling <strong>${metrics.overdueRevenue.toFixed(2)}</strong>. Offering a 10% early-bird discount can recover ~90% within 48 hours.
                </p>
              </div>
            </div>
            <button
              onClick={() => sendMessage('Who is overdue on their bills? Send them a payment reminder with a 10% discount if they pay today')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors whitespace-nowrap"
            >
              Recover Overdue Now
            </button>
          </div>
        </div>
      )}

      {/* 4. DASHBOARD & INVOICES VIEW (The Transaction Table) */}
      {(activeNavTab === 'dashboard' || activeNavTab === 'invoices') && (
        <div className="flex-1 flex flex-col space-y-3.5 min-h-0">
          {/* Controls Bar: Tabs, Search, Date, Filters, Export */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs p-3 transition-colors">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
              {/* Left Tabs with Badges */}
              <div className="flex items-center space-x-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
                {/* All */}
                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'ALL'
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{activeNavTab === 'invoices' ? 'All Invoices' : 'All Records'}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {tabCounts.all}
                  </span>
                </button>

                {/* Paid */}
                <button
                  onClick={() => setActiveTab('PAID')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'PAID'
                      ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>Paid</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tabCounts.paid}
                  </span>
                </button>

                {/* Overdue */}
                <button
                  onClick={() => setActiveTab('OVERDUE')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'OVERDUE'
                      ? 'bg-rose-50 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>Overdue</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tabCounts.overdue}
                  </span>
                </button>

                {/* Refunded */}
                <button
                  onClick={() => setActiveTab('REFUNDED')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'REFUNDED'
                      ? 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>Refunded</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tabCounts.refunded}
                  </span>
                </button>
              </div>

              {/* Right Toolbar: Search, Date, Filters, Export */}
              <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customers, items, or invoices..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Date Range Picker Pill */}
                <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/80 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Oct 1, 2026 - Oct 31, 2026</span>
                </div>

                {/* Filters Button */}
                <button
                  onClick={() => {
                    if (activeFilter) clearFilter();
                    else sendMessage('Filter transactions with amounts greater than $50');
                  }}
                  title="Toggle AI / custom filters"
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    activeFilter
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                {/* Export Dropdown Button */}
                <button
                  onClick={handleExportCsv}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Active AI Filter Indicator Badge */}
            {activeFilter && (
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-blue-700 dark:text-blue-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>
                    Active Grok Filter:{' '}
                    <strong>
                      {activeFilter.explanation ||
                        (activeFilter.statusFilter ? activeFilter.statusFilter.join(', ') : 'Custom query')}
                    </strong>
                  </span>
                </div>
                <button
                  onClick={clearFilter}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 font-semibold"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filter</span>
                </button>
              </div>
            )}
          </div>

          {/* Table Container (Fills the entire available vertical space smoothly) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col transition-colors min-h-[350px]">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-500 dark:text-slate-400 select-none">
                    <th className="py-3 px-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          paginatedData.length > 0 &&
                          paginatedData.every((t) => selectedRows.includes(t.id))
                        }
                        className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th
                      onClick={() => handleSort('id')}
                      className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Invoice / Ref</span>
                        <span className="text-[10px] text-slate-400">⇅</span>
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('date')}
                      className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date</span>
                        <span className="text-[10px] text-slate-400">⇅</span>
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('customerName')}
                      className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Customer</span>
                        <span className="text-[10px] text-slate-400">⇅</span>
                      </div>
                    </th>
                    <th className="py-3 px-3 min-w-[220px]">
                      <span>Description / Item</span>
                    </th>
                    <th
                      onClick={() => handleSort('type')}
                      className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Type</span>
                        <span className="text-[10px] text-slate-400">⇅</span>
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('amount')}
                      className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>Amount</span>
                        <span className="text-[10px] text-slate-400">⇅</span>
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('status')}
                      className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <span className="text-[10px] text-slate-400">⇅</span>
                      </div>
                    </th>
                    <th className="py-3 px-3">
                      <span>PayPal</span>
                    </th>
                    <th className="py-3 px-3 text-center">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {paginatedData.map((row) => {
                    const isSelected = selectedRows.includes(row.id);
                    const isHighlighted = highlightedIds.includes(row.id);

                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                          isSelected
                            ? 'bg-blue-50/40 dark:bg-blue-950/20'
                            : isHighlighted
                            ? 'bg-amber-50/60 dark:bg-amber-950/20'
                            : ''
                        }`}
                      >
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(row.id)}
                            className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                          />
                        </td>

                        <td className="py-3 px-3 font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {row.id}
                        </td>

                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {row.date}
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                            {row.customerName}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[170px]">
                            {row.customerEmail}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate" title={row.description}>
                          {row.description}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {row.type === 'INVOICE' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                              INVOICE
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              DIRECT ORDER
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          ${row.amount.toFixed(2)}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {row.status === 'PAID' && (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>PAID</span>
                            </span>
                          )}
                          {row.status === 'OVERDUE' && (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              <span>OVERDUE</span>
                            </span>
                          )}
                          {row.status === 'REFUNDED' && (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>REFUNDED</span>
                            </span>
                          )}
                          {row.status === 'SENT' && (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                              <span>SENT</span>
                            </span>
                          )}
                          {row.status === 'REMINDER SENT (10% OFF)' && (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                              <span>REMINDER SENT (10% OFF)</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <a
                            href={row.paypalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center space-x-1 font-semibold text-[11px]"
                          >
                            <span>Sandbox</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1 text-slate-400">
                            <button
                              onClick={() => setSelectedTransactionModal(row)}
                              title="View order details"
                              className="p-1 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (row.status === 'OVERDUE') {
                                  sendMessage(`Send overdue reminder with 10% discount to ${row.customerName} for invoice ${row.id}`);
                                } else {
                                  sendMessage(`Email receipt for order ${row.id} to ${row.customerEmail}`);
                                }
                              }}
                              title={row.status === 'OVERDUE' ? 'Send overdue reminder with discount' : 'Send receipt'}
                              className="p-1 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (row.status === 'PAID') {
                                  sendMessage(`Refund $15 to ${row.customerName} for order ${row.id}`);
                                } else {
                                  alert(`Invoice #${row.id} status: ${row.status}. PayPal Sandbox Link: ${row.paypalUrl}`);
                                }
                              }}
                              title="More options"
                              className="p-1 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer / Pagination Bar */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                Total Rows: <span className="font-bold text-slate-900 dark:text-white">{filteredData.length}</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <span>Rows per page</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                  </select>
                </div>

                <div>
                  {filteredData.length === 0
                    ? '0 of 0'
                    : `${(currentPage - 1) * pageSize + 1} - ${Math.min(
                        currentPage * pageSize,
                        filteredData.length
                      )} of ${filteredData.length}`}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="First Page"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                        currentPage === num
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Next Page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Last Page"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransactionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Transaction #{selectedTransactionModal.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTransactionModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedTransactionModal.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono">{selectedTransactionModal.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Item:</span>
                <span className="text-right font-medium max-w-[220px]">
                  {selectedTransactionModal.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span>{selectedTransactionModal.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  ${selectedTransactionModal.amount.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-blue-600">{selectedTransactionModal.status}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <a
                href={selectedTransactionModal.paypalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-semibold text-xs border border-blue-200 dark:border-blue-800 hover:bg-blue-100"
              >
                <span>Open in PayPal Sandbox</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedTransactionModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-700 text-white font-semibold text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
