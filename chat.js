// Cloudflare Pages Function: /api/chat  (hält den OpenRouter-Key geheim, nur eingeloggte Nutzer)
export async function onRequestPost({ request, env }) {
  const j = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });
  const tk = (request.headers.get('Authorization') || '').replace('Bearer ', '');
  if (!env.OPENROUTER_API_KEY) return j({ error: 'OPENROUTER_API_KEY fehlt in Cloudflare' }, 500);
  if (env.SUPABASE_URL) {
    const u = await fetch(env.SUPABASE_URL + '/auth/v1/user', { headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + tk } });
    if (!tk || !u.ok) return j({ error: 'Nicht angemeldet' }, 401);
  }
  let b; try { b = await request.json(); } catch { return j({ error: 'Ungültige Anfrage' }, 400); }
  const msgs = (b.messages || []).slice(-8).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content).slice(0, 1500) }));
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.OPENROUTER_API_KEY, 'Content-Type': 'application/json', 'HTTP-Referer': new URL(request.url).origin, 'X-Title': 'Chart Dojo' },
    body: JSON.stringify({ model: env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5', max_tokens: 700, messages: [{ role: 'system', content: String(b.system || '').slice(0, 6000) }, ...msgs] })
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) return j({ error: (d.error && d.error.message) || 'OpenRouter-Fehler' }, 502);
  return j({ text: (d.choices && d.choices[0] && d.choices[0].message.content) || '' });
}
