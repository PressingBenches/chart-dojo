# Chart Dojo – Einrichtung (ca. 20 Minuten)

Ordnerstruktur (so lassen):
```
chart-dojo/
  index.html
  supabase.sql
  functions/api/chat.js
```

## 1. Supabase
1. supabase.com → **New project** (Region Frankfurt, Passwort merken).
2. Links **SQL Editor → New query**, Inhalt von `supabase.sql` einfügen, **Run**. Unter *Table Editor* muss `dojo_data` erscheinen.
3. **Project Settings → API**: kopiere **Project URL** und den **anon public** Key (niemals den `service_role` Key verwenden).
4. Öffne `index.html`, suche ganz oben im Script (Suche: `DEINE_SUPABASE_URL`) und ersetze:
   `const SB_URL='https://xxxx.supabase.co', SB_KEY='eyJ...'`
5. **Authentication → Providers → Email** ist standardmäßig an. Zum schnellen Testen unter *Sign In / Providers → Email* „Confirm email“ ausschalten, später wieder an.
6. Nach dem Deploy: **Authentication → URL Configuration**: *Site URL* = deine Cloudflare-Adresse (`https://DEINNAME.pages.dev`).

## 2. OpenRouter
1. openrouter.ai → **Keys → Create Key**, Limit setzen (z. B. 5 $), Key kopieren.
2. Der Key kommt **nicht** in `index.html`, sondern in Cloudflare (Schritt 3.4).

## 3. Cloudflare Pages
1. Ordner `chart-dojo` in ein neues GitHub-Repo hochladen (github.com → New repository → „uploading an existing file“).
2. dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git** → Repo wählen.
3. Build-Einstellungen: Framework **None**, Build command **leer**, Output directory **/** → **Save and Deploy**.
4. **Settings → Variables and Secrets** (Production) hinzufügen, danach neu deployen:
   - `OPENROUTER_API_KEY` = dein Key (Typ *Secret*)
   - `SUPABASE_URL` = deine Project URL
   - `SUPABASE_ANON_KEY` = dein anon Key
   - optional `OPENROUTER_MODEL` = z. B. `anthropic/claude-haiku-4.5` oder `openai/gpt-4o-mini`
5. Fertig: `https://DEINNAME.pages.dev`. Alternativ ohne GitHub: `npx wrangler pages deploy . --project-name chart-dojo` im Ordner.

## Hell/Dunkel
Der Button (Halbkreis-Symbol) sitzt auf dem Login und im App-Kopf; die Wahl wird im Browser gemerkt.

## Fehlersuche
- Login-Karte zeigt „Supabase noch nicht verbunden“ → URL/Key in `index.html` fehlen.
- Coach meldet „401 / Nicht angemeldet“ → `SUPABASE_URL` und `SUPABASE_ANON_KEY` in Cloudflare prüfen.
- Coach meldet „OPENROUTER_API_KEY fehlt“ → Variable setzen und neu deployen.
- Der Coach funktioniert nur auf der Cloudflare-Seite, nicht beim Öffnen der Datei per Doppelklick.
