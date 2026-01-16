# Pokedex (Next.js)

A minimal Next.js app with a Catch button and a table (“name”, “tx”). The table polls your backend state every 3 seconds.

## Scripts

- `npm run dev` — starts Next dev server on port 3000
- `npm run build` — builds for production
- `npm start` — runs the production build on port 3000

## Upstream backend config

The UI proxies to your backend via Next API routes. Configure the backend location using env vars (create `.env.local` from the example):

```
cp .env.local.example .env.local
# edit if needed
```

Vars:
- `UPSTREAM_PROTOCOL` — `http` or `https` (default: `http`)
- `UPSTREAM_HOST` — hostname (default: `127.0.0.1`)
- `UPSTREAM_PORT` — port (default: `5001`)
- `UPSTREAM_PREFIX` — base path, e.g. `/v1` or empty (default: `/v1`)

The app calls these upstream endpoints:
- POST `${UPSTREAM_PREFIX}/tx`
- GET `${UPSTREAM_PREFIX}/state?key=...`

## Notes

- The table caption and page title are “Pokedex”.
- The table expects API responses like `{ "pokemons": "[{\\"id\\":1,\\"name\\":\\"Bulbasaur\\",\\"tx\\":\\"...\\"}]" }`.
- The button sends body: `{ "command": "{\"type\":\"catch\",\"value\":{\"msg\":\"hi\"}}" }`.
- Poll interval is 3 seconds; adjust `POLL_MS` in `app/page.tsx` if needed.
