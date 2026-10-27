'use client';

import React, { useMemo, useState, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ICellRendererParams,
  GridReadyEvent,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { useStore } from '@/context/StoreContext';
import { Transaction, PaymentStatus } from '@/types';
import KpiCards from './KpiCards';
import {
  Filter,
  X,
  Download,
  Search,
  ExternalLink,
  Sparkles,
  Layers,
  Clock,
  RotateCcw,
} from 'lucide-react';

export default function FinancialWorkbench() {
  const {
    transactions,
    activeFilter,
    highlightedIds,
    clearFilter,
    sendMessage,
  } = useStore();

  const gridRef = useRef<AgGridReact<Transaction>>(null);
  const [quickSearch, setQuickSearch] = useState('');
  const [statusTab, setStatusTab] = useState<'ALL' | PaymentStatus>('ALL');

  // Filter transactions based on AI filter, manual status tab, and search query
  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      // 1. AI Filter constraint
      if (activeFilter) {
        if (activeFilter.statusFilter && activeFilter.statusFilter.length > 0) {
          if (!activeFilter.statusFilter.includes(t.status)) return false;
        }
        if (activeFilter.minAmount !== undefined && t.amount < activeFilter.minAmount) {
          return false;
        }
        if (activeFilter.maxAmount !== undefined && t.amount > activeFilter.maxAmount) {
          return false;
        }
      }

      // 2. Manual status tab (if active)
      if (statusTab !== 'ALL' && t.status !== statusTab) {
        return false;
      }

      // 3. Quick search
      if (quickSearch.trim()) {
        const query = quickSearch.toLowerCase();
        const matchesName = t.customerName.toLowerCase().includes(query);
        const matchesEmail = t.customerEmail.toLowerCase().includes(query);
        const matchesId = t.id.toLowerCase().includes(query);
        const matchesDesc = t.description.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesId && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, activeFilter, statusTab, quickSearch]);

  // CSV Export
  const handleExportCsv = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `sweetcrumb-bakery-financials-${new Date().toISOString().split('T')[0]}.csv`,
      });
    }
  }, []);

  // AG Grid Custom Cell Renderers
  const StatusBadgeRenderer = (params: ICellRendererParams<Transaction>) => {
    const status = params.value as PaymentStatus;
    if (!status) return null;

    let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
    let dotClass = 'bg-slate-400';
    let pulse = false;

    if (status === 'PAID') {
      badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotClass = 'bg-emerald-500';
    } else if (status === 'SENT') {
      badgeClass = 'bg-sky-50 text-sky-700 border-sky-200';
      dotClass = 'bg-sky-500';
    } else if (status === 'OVERDUE') {
      badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
      dotClass = 'bg-rose-500';
      pulse = true;
    } else if (status === 'REFUNDED') {
      badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
      dotClass = 'bg-amber-500';
    } else if (status === 'REMINDER SENT (10% OFF)') {
      badgeClass = 'bg-purple-50 text-purple-700 border-purple-200 font-semibold';
      dotClass = 'bg-purple-500';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${badgeClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass} ${pulse ? 'animate-ping' : ''}`} />
        <span>{status}</span>
      </span>
    );
  };

  const CustomerRenderer = (params: ICellRendererParams<Transaction>) => {
    const data = params.data;
    if (!data) return null;
    return (
      <div className="flex flex-col justify-center h-full leading-tight py-1">
        <span className="font-semibold text-xs text-slate-900">{data.customerName}</span>
        <span className="text-[11px] text-slate-400 truncate">{data.customerEmail}</span>
      </div>
    );
  };

  const IdRenderer = (params: ICellRendererParams<Transaction>) => {
    const id = params.value;
    return (
      <div className="flex items-center h-full">
        <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
          {id}
        </span>
      </div>
    );
  };

  const AmountRenderer = (params: ICellRendererParams<Transaction>) => {
    const amount = params.value as number;
    const isRefund = params.data?.status === 'REFUNDED';
    return (
      <div className="flex items-center justify-end h-full font-bold text-xs">
        <span className={isRefund ? 'text-amber-700 line-through' : 'text-slate-900'}>
          ${amount ? amount.toFixed(2) : '0.00'}
        </span>
      </div>
    );
  };

  const TypeRenderer = (params: ICellRendererParams<Transaction>) => {
    const type = params.value;
    const isInvoice = type === 'INVOICE';
    return (
      <div className="flex items-center h-full">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
            isInvoice
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {isInvoice ? 'Invoice' : 'Direct Order'}
        </span>
      </div>
    );
  };

  const PayPalLinkRenderer = (params: ICellRendererParams<Transaction>) => {
    const url = params.value || params.data?.paypalUrl;
    if (!url) return null;
    return (
      <div className="flex items-center h-full">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-paypal-blue hover:text-paypal-dark hover:underline"
        >
          <span>Sandbox</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  };

  const QuickActionRenderer = (params: ICellRendererParams<Transaction>) => {
    const data = params.data;
    if (!data) return null;

    if (data.status === 'OVERDUE') {
      return (
        <div className="flex items-center h-full">
          <button
            onClick={() =>
              sendMessage(`Send overdue reminder with 10% discount to ${data.customerName}`)
            }
            className="flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded transition-colors"
          >
            <Clock className="w-3 h-3" />
            <span>Remind</span>
          </button>
        </div>
      );
    }

    if (data.status === 'PAID') {
      return (
        <div className="flex items-center h-full">
          <button
            onClick={() =>
              sendMessage(`Refund partial amount to ${data.customerName}`)
            }
            className="flex items-center gap-1 text-[11px] font-medium text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Refund</span>
          </button>
        </div>
      );
    }

    return null;
  };

  // AG Grid Column Definitions
  const columnDefs: ColDef<Transaction>[] = useMemo(
    () => [
      {
        headerName: 'PayPal Ref',
        field: 'id',
        width: 155,
        cellRenderer: IdRenderer,
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Date',
        field: 'date',
        width: 110,
        sortable: true,
        cellRenderer: (p: ICellRendererParams) => (
          <span className="text-xs text-slate-600">{p.value}</span>
        ),
      },
      {
        headerName: 'Customer',
        field: 'customerName',
        width: 190,
        cellRenderer: CustomerRenderer,
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Description / Item',
        field: 'description',
        minWidth: 240,
        flex: 1,
        cellRenderer: (p: ICellRendererParams) => (
          <span className="text-xs text-slate-700 truncate block" title={p.value}>
            {p.value}
          </span>
        ),
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Type',
        field: 'type',
        width: 125,
        cellRenderer: TypeRenderer,
        sortable: true,
      },
      {
        headerName: 'Amount',
        field: 'amount',
        width: 110,
        cellRenderer: AmountRenderer,
        sortable: true,
        headerClass: 'ag-right-aligned-header',
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 185,
        cellRenderer: StatusBadgeRenderer,
        sortable: true,
        filter: true,
      },
      {
        headerName: 'PayPal Link',
        field: 'paypalUrl',
        width: 110,
        cellRenderer: PayPalLinkRenderer,
      },
      {
        headerName: 'Action',
        width: 95,
        cellRenderer: QuickActionRenderer,
      },
    ],
    []
  );

  // Row styling for highlighted IDs
  const rowClassRules = useMemo(
    () => ({
      'bg-sky-50 font-medium border-l-4 border-paypal-blue': (params: any) =>
        highlightedIds.includes(params.data?.id),
    }),
    [highlightedIds]
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      suppressMovable: false,
    }),
    []
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 sm:p-6 overflow-y-auto">
      {/* Top 3 KPI Metric Cards */}
      <KpiCards />

      {/* Active AI Filter Banner */}
      {activeFilter && (
        <div className="mb-4 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-3 flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-paypal-blue text-white rounded-lg shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-paypal-blue text-white px-2 py-0.5 rounded">
                  Active AI Filter
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {activeFilter.explanation || 'Table filtered dynamically by Grok AI'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Displaying {filteredData.length} matching records on live AG Grid workbench.
              </p>
            </div>
          </div>
          <button
            onClick={clearFilter}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear AI Filter</span>
          </button>
        </div>
      )}

      {/* Workbench Toolbar */}
      <div className="bg-white border border-app-border rounded-t-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        {/* Left: Quick search & status pills */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex items-center w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search customers, items, IDs..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-paypal-blue focus:bg-white transition-colors"
            />
          </div>

          {/* Quick filter pills */}
          <div className="flex items-center space-x-1 text-xs">
            {(['ALL', 'PAID', 'OVERDUE', 'REFUNDED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  statusTab === tab
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All Records' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right: AG Grid prize badge, count & CSV Export */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-paypal-blue" />
            <span>AG Grid Live Table ({filteredData.length} records)</span>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
            title="Download table data as CSV"
          >
            <Download className="w-3.5 h-3.5 text-paypal-blue" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Centerpiece AG Grid Table (ag-theme-quartz) */}
      <div className="flex-1 min-h-[460px] bg-white border-x border-b border-app-border rounded-b-xl shadow-sm overflow-hidden">
        <div className="ag-theme-quartz w-full h-full text-xs">
          <AgGridReact<Transaction>
            ref={gridRef}
            rowData={filteredData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowClassRules={rowClassRules}
            animateRows={true}
            pagination={true}
            paginationPageSize={15}
            paginationPageSizeSelector={[10, 15, 25, 50]}
            rowHeight={46}
            headerHeight={40}
            suppressCellFocus={true}
          />
        </div>
      </div>
    </div>
  );
}
