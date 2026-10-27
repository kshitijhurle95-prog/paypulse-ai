'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Transaction, PaymentStatus } from '@/types';
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
  Check,
  X,
  Layers,
} from 'lucide-react';

export default function FinancialWorkbench() {
  const {
    transactions,
    activeFilter,
    highlightedIds,
    clearFilter,
    sendMessage,
    metrics,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'ALL' | PaymentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedTransactionModal, setSelectedTransactionModal] = useState<Transaction | null>(null);

  // Tab counts
  const tabCounts = useMemo(() => {
    let paid = 0;
    let overdue = 0;
    let refunded = 0;
    transactions.forEach((t) => {
      if (t.status === 'PAID') paid++;
      else if (t.status === 'OVERDUE') overdue++;
      else if (t.status === 'REFUNDED') refunded++;
    });
    return {
      all: transactions.length,
      paid,
      overdue,
      refunded,
    };
  }, [transactions]);

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    let result = [...transactions];

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
  }, [transactions, activeFilter, activeTab, searchQuery, sortField, sortAsc]);

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
      {/* 1. Hero Bakery Banner Card matching Image 2 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFFBF5] via-[#FFF8EE] to-[#F8FAFC] dark:from-[#111827] dark:via-[#162032] dark:to-[#0F172A] border border-[#F3E8D7] dark:border-slate-800 p-5 sm:p-6 mb-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          {/* Left Greeting Text */}
          <div className="space-y-1.5 max-w-md">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>☀️ Good morning, Kshitij! 👋</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your bakery's finances, simplified.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Get insights, take action, and grow with AI.
            </p>
          </div>

          {/* Center: Bakery Croissants & Coffee Photo Cutout */}
          <div className="relative flex-shrink-0 flex items-center justify-center">
            <div className="relative w-64 sm:w-80 h-28 sm:h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white/80 dark:border-slate-700/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/bakery-croissants.jpg"
                alt="SweetCrumb Artisan Bakery Croissants & Coffee"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback to high-res Unsplash image if local is unavailable
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right Quote */}
          <div className="hidden lg:flex flex-col items-end text-right max-w-[200px] border-l border-amber-200/60 dark:border-slate-700/60 pl-4">
            <span className="text-2xl font-serif text-amber-500/80 dark:text-amber-400/80 leading-none">“</span>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 italic -mt-2">
              Turn conversations into cashflow control.
            </p>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">— PayPulse AI</span>
          </div>
        </div>
      </div>

      {/* 2. Four KPI Summary Cards with Sparklines */}
      <KpiCards />

      {/* 3. Transaction Bar Controls (Tabs, Search, Date, Filters, Export) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs p-3.5 mb-3.5 transition-colors">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Left Tabs with Badges */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            {/* All Invoices */}
            <button
              onClick={() => setActiveTab('ALL')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>All Invoices</span>
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

          {/* Right Toolbar: Search, Date Picker, Filters, Export */}
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
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Active AI Filter Indicator Badge */}
        {activeFilter && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
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

      {/* 4. The Bar Sheet Transaction Table matching Image 2 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col transition-colors">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-500 dark:text-slate-400 select-none">
                {/* Select All Checkbox */}
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

                {/* Invoice / Ref */}
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Invoice / Ref</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>

                {/* Date */}
                <th
                  onClick={() => handleSort('date')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>

                {/* Customer */}
                <th
                  onClick={() => handleSort('customerName')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Customer</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>

                {/* Description / Item */}
                <th className="py-3 px-3 min-w-[220px]">
                  <span>Description / Item</span>
                </th>

                {/* Type */}
                <th
                  onClick={() => handleSort('type')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Type</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>

                {/* Amount */}
                <th
                  onClick={() => handleSort('amount')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Amount</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>

                {/* Status */}
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <span className="text-[10px] text-slate-400">⇅</span>
                  </div>
                </th>

                {/* PayPal */}
                <th className="py-3 px-3">
                  <span>PayPal</span>
                </th>

                {/* Actions */}
                <th className="py-3 px-3 text-center">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
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
                    {/* Checkbox */}
                    <td className="py-3 px-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(row.id)}
                        className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    {/* Invoice / Ref */}
                    <td className="py-3 px-3 font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {row.id}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {row.date}
                    </td>

                    {/* Customer (Name bold + Email below) */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {row.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[170px]">
                        {row.customerEmail}
                      </div>
                    </td>

                    {/* Description / Item */}
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate" title={row.description}>
                      {row.description}
                    </td>

                    {/* Type Badge */}
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

                    {/* Amount */}
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      ${row.amount.toFixed(2)}
                    </td>

                    {/* Status Pill with colored bullet dot */}
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

                    {/* PayPal External Link */}
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

                    {/* Actions: View, Remind/Refund, Menu */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1 text-slate-400">
                        {/* 1. View Details Modal */}
                        <button
                          onClick={() => setSelectedTransactionModal(row)}
                          title="View order details"
                          className="p-1 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* 2. Remind / Mail Action */}
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

                        {/* 3. Kebab Menu */}
                        <button
                          onClick={() => {
                            if (row.status === 'PAID') {
                              sendMessage(`Refund $15 to ${row.customerName} for order ${row.id}`);
                            } else {
                              alert(`Invoice #${row.id} is in status ${row.status}. PayPal Sandbox link: ${row.paypalUrl}`);
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

        {/* 5. Footer / Pagination Bar matching Image 2 */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          {/* Left: Total Rows */}
          <div className="font-semibold text-slate-700 dark:text-slate-300">
            Total Rows: <span className="font-bold text-slate-900 dark:text-white">{filteredData.length}</span>
          </div>

          {/* Right: Rows per page + Range + Page Buttons */}
          <div className="flex items-center space-x-4">
            {/* Rows per page dropdown */}
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

            {/* Current Range */}
            <div>
              {filteredData.length === 0
                ? '0 of 0'
                : `${(currentPage - 1) * pageSize + 1} - ${Math.min(
                    currentPage * pageSize,
                    filteredData.length
                  )} of ${filteredData.length}`}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">
              {/* First Page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>

              {/* Prev Page */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Numbered Page Buttons */}
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

              {/* Next Page */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Last Page */}
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
