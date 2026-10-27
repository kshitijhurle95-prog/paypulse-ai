import { NextRequest, NextResponse } from 'next/server';
import { processUserMessageWithGrok } from '@/lib/grok';
import { ApiLog } from '@/types';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { message, history = [], transactions = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const grokResult = await processUserMessageWithGrok(message, history, transactions);
    const durationMs = Date.now() - startTime;

    const apiLog: ApiLog = {
      id: `log_grok_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      service: 'xAI Grok',
      endpoint: 'https://api.x.ai/v1/chat/completions',
      method: 'POST',
      status: 200,
      durationMs,
      request: grokResult.rawRequest || { model: grokResult.modelUsed, prompt: message },
      response: grokResult.rawResponse || {
        reply: grokResult.reply,
        gridAction: grokResult.gridAction,
        pendingPayPalAction: grokResult.pendingPayPalAction,
      },
    };

    return NextResponse.json({
      reply: grokResult.reply,
      gridAction: grokResult.gridAction,
      pendingPayPalAction: grokResult.pendingPayPalAction,
      log: apiLog,
      modelUsed: grokResult.modelUsed,
      liveApiUsed: grokResult.liveApiUsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
