# Acterware website

React SPA (静的アセット) + Workers API (`/api/*`) のテンプレート。

## 開発

```bash
npm install
npm run dev
```

## デプロイ

```bash
npm run build
npx wrangler deploy
```

## 構成

- `/` → React SPA (静的アセット)
- `/api/*` → Workers API (動的処理)
- その他 → SPAモードで `index.html` を返す
