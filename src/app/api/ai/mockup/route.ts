import { NextResponse } from 'next/server';

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

interface MockupRequest {
  imageBase64?: string;
  imageMime?: string;
  productName?: string;
  productCategory?: string;
  selectedColor?: string;
  selectedType?: string;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonError('Configura OPENAI_API_KEY en el servidor para activar la vista previa IA.', 503);
  }

  let body: MockupRequest;
  try {
    body = await request.json();
  } catch {
    return jsonError('Solicitud inválida.', 400);
  }

  const {
    imageBase64,
    imageMime = 'image/png',
    productName = 'producto personalizado',
    productCategory = 'producto',
    selectedColor = '',
    selectedType = '',
  } = body;

  if (!imageBase64) {
    return jsonError('Sube una imagen para generar la vista previa.', 400);
  }

  if (!/^image\/(png|jpe?g|webp)$/i.test(imageMime)) {
    return jsonError('Formato no soportado. Usa PNG, JPG o WEBP.', 400);
  }

  const byteLength = Buffer.byteLength(imageBase64, 'base64');
  if (byteLength > MAX_IMAGE_BYTES) {
    return jsonError('La imagen es muy pesada. Usa un archivo menor a 4 MB.', 413);
  }

  const productDetails = [
    `Producto: ${productName}`,
    `Categoría: ${productCategory}`,
    selectedColor ? `Color seleccionado: ${selectedColor}` : '',
    selectedType ? `Tipo/modelo seleccionado: ${selectedType}` : '',
  ].filter(Boolean).join('\n');

  const prompt = `Analiza el diseño subido por el cliente y recomienda cómo se vería aplicado en este producto personalizado.\n${productDetails}\n\nDevuelve solo JSON válido con estas claves:\n{\n  "headline": "frase corta de máximo 55 caracteres",\n  "placement": "ubicación recomendada del estampado",\n  "technique": "técnica recomendada: serigrafía, sublimación, vinilo, DTF o bordado",\n  "note": "nota breve para el cliente en español chileno, máximo 140 caracteres"\n}\nNo inventes precios ni plazos.`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', image_url: `data:${imageMime};base64,${imageBase64}` },
          ],
        }],
        text: { format: { type: 'json_object' } },
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = data?.error?.message || `OpenAI respondió con error ${response.status}.`;
      return jsonError(message, response.status);
    }

    const outputText = data?.output_text
      || data?.output?.flatMap((item: { content?: { text?: string }[] }) => item.content || []).map((content: { text?: string }) => content.text || '').join('')
      || '';

    const ai = JSON.parse(outputText);
    return NextResponse.json({
      headline: String(ai.headline || 'Vista previa sugerida'),
      placement: String(ai.placement || 'Centrado en zona principal'),
      technique: String(ai.technique || 'DTF'),
      note: String(ai.note || 'Mockup referencial: confirmaremos medidas y color antes de producir.'),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo generar la vista previa.';
    return jsonError(message, 500);
  }
}
