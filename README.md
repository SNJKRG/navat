# NAVAT Чайкана — сайт

Кыргызская версия сайта NAVAT (Бишкек, Ош). Vite + React + TypeScript.

```bash
npm install
npm run dev      # разработка, http://localhost:5173
npm run build    # сборка в dist/
```

- Тексты и данные: `src/content.ts`
- Hero (скролл-сцена, арабесковые ворота, видео): `src/Hero.tsx`, `src/dust.ts`, видео в `public/hero/`
- Деплой: Vercel, Framework = Vite, кэш-заголовки в `vercel.json`
