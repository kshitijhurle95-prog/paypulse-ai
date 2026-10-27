'use client';

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Terminal,
  Check,
  Copy,
  ShieldCheck,
  Zap,
  Bot,
  ChevronDown,
  ChevronUp,
  Server,
} from 'lucide-react';

export default function ApiInspectorDrawer() {
  const { isInspectorOpen, setIsInspectorOpen, apiLogs } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isInspectorOpen) return null;

  const filteredLogs = apiLogs.filter((log) => {
    if (selectedFilter === 'ALL') return true;
    return log.service === selectedFilter;
  });

  const handleCopyJson = (log: any, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getServiceBadge = (service: string) => {
    switch (service) {
      case 'PayPal Sandbox':
        return (
          <span className="inline-flex items-center gap-1 bg-sky-50 text-paypal-blue border border-sky-200 px-2 py-0.5 rounded text-[11px] font-semibold">
            <ShieldCheck className="w-3 h-3" />
            <span>PayPal Sandbox</span>
          </span>
        );
      case 'xAI Grok':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-semibold">
            <Bot className="w-3 h-3" />
            <span>xAI Grok</span>
          </span>
        );
      case 'Zapier Webhook':
      case 'Zapier MCP':
        return (
          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded text-[11px] font-semibold">
            <Zap className="w-3 h-3" />
            <span>Zapier MCP / Webhook</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold">
            <Server className="w-3 h-3" />
            <span>{service}</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-slate-900 border-t-2 border-slate-300 dark:border-slate-700 shadow-2xl transition-all duration-300 flex flex-col max-h-[500px] h-[450px]">
      {/* Header */}
      <div className="p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-paypal-blue text-white rounded-lg shadow-sm">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold tracking-tight text-white">
                Live API & Webhook Inspector Drawer
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full font-mono">
                Real-time Network Telemetry
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Inspect real JSON requests & responses exchanged between xAI Grok, PayPal Sandbox REST APIs, AG Grid Enterprise, and Zapier MCP.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Service Filter Tabs */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            {['ALL', 'PayPal Sandbox', 'xAI Grok', 'Zapier Webhook'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-paypal-blue text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter === 'ALL' ? 'All Services' : filter}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsInspectorOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Terminal className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">No API logs recorded yet for this filter.</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div
                key={log.id}
                className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Log Header Row */}
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status >= 200 && log.status < 300
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.status}
                    </span>

                    {getServiceBadge(log.service)}

                    <span className="font-semibold text-slate-700">{log.method}</span>
                    <span className="text-slate-500 truncate max-w-[340px] text-[11px]" title={log.endpoint}>
                      {log.endpoint}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                    {log.durationMs && <span>{log.durationMs}ms</span>}
                    <span>{log.timestamp}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyJson(log, log.id);
                      }}
                      className="p-1 hover:text-slate-800 rounded hover:bg-slate-200 transition-colors"
                      title="Copy JSON Payload"
                    >
                      {copiedId === log.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Payload Viewer */}
                {isExpanded && (
                  <div className="p-3 border-t border-slate-200 bg-slate-900 text-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-between">
                        <span>Request Payload</span>
                      </div>
                      <pre className="bg-slate-950 p-2.5 rounded border border-slate-800 overflow-x-auto max-h-[160px] text-emerald-400 font-mono">
                        {JSON.stringify(log.request, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-between">
                        <span>Response Payload</span>
                      </div>
                      <pre className="bg-slate-950 p-2.5 rounded border border-slate-800 overflow-x-auto max-h-[160px] text-sky-400 font-mono">
                        {JSON.stringify(log.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
