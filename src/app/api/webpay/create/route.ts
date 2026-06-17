// src/app/api/webpay/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } from 'transbank-sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, buyOrder, sessionId, returnUrl } = body;

    // Validaciones básicas
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }
    if (!buyOrder || !sessionId || !returnUrl) {
      return NextResponse.json({ error: 'Parámetros faltantes' }, { status: 400 });
    }

    // ── Configurar SDK ───────────────────────────────────────────────
    // En integración (testing) se usan credenciales de prueba.
    // En producción, Transbank entrega el commerceCode y apiKey reales.
    const isProduction = process.env.TRANSBANK_ENV === 'production';

    const options = isProduction
      ? new Options(
          process.env.TRANSBANK_COMMERCE_CODE!,
          process.env.TRANSBANK_API_KEY!,
          Environment.Production
        )
      : new Options(
          IntegrationCommerceCodes.WEBPAY_PLUS,
          IntegrationApiKeys.WEBPAY,
          Environment.Integration
        );

    const tx = new WebpayPlus.Transaction(options);

    // ── Crear transacción ─────────────────────────────────────────────
    const response = await tx.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    // response.url  = URL donde redirigir al usuario
    // response.token = token que va en el POST
    return NextResponse.json({
      url: response.url,
      token: response.token,
    });

  } catch (err: unknown) {
    console.error('[Webpay create]', err);
    const msg = err instanceof Error ? err.message : 'Error al crear transacción';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
