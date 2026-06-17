// src/app/api/webpay/commit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } from 'transbank-sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token_ws } = body;

    if (!token_ws) {
      return NextResponse.json({ error: 'Token faltante' }, { status: 400 });
    }

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
    const response = await tx.commit(token_ws);

    // response.status puede ser "AUTHORIZED" o "FAILED"
    return NextResponse.json({
      status: response.status,
      authorizationCode: response.authorization_code,
      amount: response.amount,
      buyOrder: response.buy_order,
      cardNumber: response.card_detail?.card_number,
      transactionDate: response.transaction_date,
    });

  } catch (err: unknown) {
    console.error('[Webpay commit]', err);
    const msg = err instanceof Error ? err.message : 'Error al confirmar pago';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
