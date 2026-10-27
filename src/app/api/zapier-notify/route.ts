import { NextRequest, NextResponse } from 'next/server';
import { ApiLog } from '@/types';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { eventType, payload } = body;
    const webhookUrl = process.env.ZAPIER_WEBHOOK_URL?.trim();

    const outboundPayload = {
      event: eventType || 'PAYPULSE_EVENT',
      timestamp: new Date().toISOString(),
      store: 'SweetCrumb Artisan Bakery',
      environment: process.env.PAYPAL_ENVIRONMENT || 'SANDBOX',
      data: payload,
    };

    let responseData: any = null;
    let httpStatus = 200;

    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        const zapierRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(outboundPayload),
        });
        httpStatus = zapierRes.status;
        responseData = await zapierRes.text();
      } catch (err: any) {
        responseData = { error: err.message, status: 'FAILED_TO_DELIVER' };
        httpStatus = 502;
      }
    } else {
      // Mock delivery when webhook is not configured
      responseData = {
        status: 'DELIVERED_MOCK_SANDBOX',
        message: 'Zapier Webhook simulated successfully (Add ZAPIER_WEBHOOK_URL in .env.local to target your real Zap)',
        receivedAt: new Date().toISOString(),
      };
    }

    const durationMs = Date.now() - startTime;

    const apiLog: ApiLog = {
      id: `log_zapier_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      service: 'Zapier Webhook',
      endpoint: webhookUrl || 'https://hooks.zapier.com/hooks/catch/paypulse/sandbox',
      method: 'POST',
      status: httpStatus,
      durationMs,
      request: outboundPayload,
      response: responseData,
    };

    return NextResponse.json({
      success: true,
      log: apiLog,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to dispatch Zapier webhook' },
      { status: 500 }
    );
  }
}
