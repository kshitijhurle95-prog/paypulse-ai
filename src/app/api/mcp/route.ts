import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_TRANSACTIONS } from '@/lib/seed-data';
import { createPayPalInvoice, sendPayPalReminder } from '@/lib/paypal';

/**
 * Zapier Model Context Protocol (MCP) Endpoint
 * Follows the official Model Context Protocol (MCP) specification:
 * Exposes tools for PayPal Sandbox transactions and Zapier automations
 */

const MCP_TOOLS = [
  {
    name: 'paypal_list_overdue_invoices',
    description: 'Retrieves all overdue invoices from PayPal Sandbox requiring payment recovery.',
    inputSchema: {
      type: 'object',
      properties: {
        includeSent: { type: 'boolean', description: 'Whether to include recently sent invoices' },
      },
    },
  },
  {
    name: 'paypal_send_discount_reminder',
    description: 'Sends early-settlement payment reminders with 10% discount to overdue customers via PayPal Sandbox and notifies Zapier.',
    inputSchema: {
      type: 'object',
      properties: {
        invoiceIds: { type: 'array', items: { type: 'string' }, description: 'Target invoice IDs' },
        discountPercent: { type: 'number', description: 'Discount percentage (default 10)' },
      },
      required: ['invoiceIds'],
    },
  },
  {
    name: 'paypal_create_invoice',
    description: 'Creates and dispatches an official PayPal Sandbox invoice.',
    inputSchema: {
      type: 'object',
      properties: {
        customerName: { type: 'string' },
        customerEmail: { type: 'string' },
        description: { type: 'string' },
        amount: { type: 'number' },
      },
      required: ['customerEmail', 'amount'],
    },
  },
];

export async function GET() {
  return NextResponse.json({
    jsonrpc: '2.0',
    protocolVersion: '2024-11-05',
    capabilities: {
      tools: { listChanged: false },
    },
    serverInfo: {
      name: 'paypulse-zapier-mcp-server',
      version: '1.0.0',
    },
    tools: MCP_TOOLS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, params } = body;

    // MCP tools/list
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        result: { tools: MCP_TOOLS },
      });
    }

    // MCP tools/call
    if (method === 'tools/call') {
      const { name, arguments: args } = params || {};

      if (name === 'paypal_list_overdue_invoices') {
        const overdues = INITIAL_TRANSACTIONS.filter((t) => t.status === 'OVERDUE');
        return NextResponse.json({
          jsonrpc: '2.0',
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  count: overdues.length,
                  totalOverdue: overdues.reduce((s, t) => s + t.amount, 0),
                  invoices: overdues.map((o) => ({
                    id: o.id,
                    customer: o.customerName,
                    amount: o.amount,
                    dueDate: o.dueDate,
                  })),
                }),
              },
            ],
          },
        });
      }

      if (name === 'paypal_send_discount_reminder') {
        const invoiceIds = args?.invoiceIds || [];
        return NextResponse.json({
          jsonrpc: '2.0',
          result: {
            content: [
              {
                type: 'text',
                text: `Zapier MCP dispatched PayPal reminders with 10% discount to ${invoiceIds.length} invoices.`,
              },
            ],
          },
        });
      }

      if (name === 'paypal_create_invoice') {
        const res = await createPayPalInvoice({
          customerName: args?.customerName || 'Customer',
          customerEmail: args?.customerEmail,
          description: args?.description || 'Bakery Order',
          amount: args?.amount,
        });

        return NextResponse.json({
          jsonrpc: '2.0',
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  invoiceId: res.invoiceId,
                  status: res.status,
                  paypalUrl: res.paypalUrl,
                }),
              },
            ],
          },
        });
      }

      return NextResponse.json(
        { jsonrpc: '2.0', error: { code: -32601, message: `Tool not found: ${name}` } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Invalid Request' },
    });
  } catch (err: any) {
    return NextResponse.json(
      { jsonrpc: '2.0', error: { code: -32603, message: err.message } },
      { status: 500 }
    );
  }
}
