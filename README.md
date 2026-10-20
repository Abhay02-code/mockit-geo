# MockIt - Conservation Geography

Practice exam web app (Week 0-12). Next.js + React + Tailwind.

## Run locally
1. Double-click `open-in-vscode.bat` (opens this folder in VS Code)
2. In VS Code terminal (Ctrl+`):  `npm install`  then  `npm run dev`
3. Open http://localhost:3000

(or just double-click `start.bat`)

## Deploy on Render
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Env var: `NODE_VERSION` = `22`

## Add / edit questions
Edit `lib/questions/geo.ts`. Fields: id, week, question, options[4], correctAnswer (0-based), explanation.
