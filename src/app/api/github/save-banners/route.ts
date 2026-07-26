import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN  = process.env.GITHUB_TOKEN!;
const GITHUB_REPO   = process.env.GITHUB_REPO!;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILE_PATH     = 'src/data/banners.ts';

export async function POST(req: NextRequest) {
  try {
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      return NextResponse.json(
        { error: 'Faltan GITHUB_TOKEN y GITHUB_REPO en las variables de entorno de Vercel' },
        { status: 500 }
      );
    }

    const { content } = await req.json();
    if (!content) return NextResponse.json({ error: 'Falta el contenido' }, { status: 400 });

    const apiBase = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
    const headers: HeadersInit = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    };

    const getRes = await fetch(`${apiBase}?ref=${GITHUB_BRANCH}`, { headers });
    if (!getRes.ok) throw new Error(`GitHub GET error: ${getRes.status}`);
    const { sha } = await getRes.json();

    const encoded = Buffer.from(content, 'utf-8').toString('base64');
    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: '🖼️ Admin: actualización de banners',
        content: encoded,
        sha,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      throw new Error(err.message || `GitHub PUT error: ${putRes.status}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
