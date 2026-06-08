# J.A.R.V.I.S — KI-Assistent

Ein Jarvis-artiger KI-Assistent mit Web-Suche, gebaut mit React + Vite + Vercel.

## Setup lokal

```bash
npm install
```

Erstelle eine `.env` Datei:
```
ANTHROPIC_API_KEY=sk-ant-dein-key-hier
```

```bash
npm run dev
```

## Deploy auf Vercel

### Option 1: Vercel CLI (schnellste Methode)

```bash
npm install -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard

1. Repo auf GitHub pushen:
```bash
git init
git add .
git commit -m "Initial commit: J.A.R.V.I.S"
git remote add origin https://github.com/DEIN-USERNAME/jarvis-app.git
git push -u origin main
```

2. Auf [vercel.com](https://vercel.com) einloggen
3. "New Project" → GitHub Repo importieren
4. **Environment Variables** setzen:
   - `ANTHROPIC_API_KEY` = dein Anthropic API Key
5. Deploy!

## Projektstruktur

```
jarvis-app/
├── src/
│   ├── main.jsx       # React Entry Point
│   ├── App.jsx        # Haupt-Komponente
│   ├── App.css        # Styling
│   └── index.css      # Globales CSS
├── api/
│   └── chat.js        # Vercel Serverless Function (API Route)
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

## API Key holen

→ [console.anthropic.com](https://console.anthropic.com)
