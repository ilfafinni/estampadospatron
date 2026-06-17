// src/app/api/cloudinary/upload/route.ts
// API Route para subir imágenes de productos a Cloudinary desde el admin
// (las fotos de clientes/logos se suben directo desde el frontend)

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, productId, folder = 'patronestampados/productos' } = body;

    if (!data) {
      return NextResponse.json({ error: 'Imagen requerida (base64)' }, { status: 400 });
    }

    const result = await cloudinary.uploader.upload(data, {
      folder,
      public_id: productId ? `producto-${productId}` : undefined,
      overwrite: true,
      transformation: [
        { width: 800, height: 800, crop: 'fill', gravity: 'center' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });

  } catch (err: unknown) {
    console.error('[Cloudinary upload]', err);
    const msg = err instanceof Error ? err.message : 'Error al subir imagen';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET: Genera una firma para uploads directos desde el cliente (más seguro y rápido)
export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'patronestampados/logos-clientes';

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error al generar firma';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
