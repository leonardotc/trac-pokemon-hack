"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';

type Row = { id: number; name: string; tx: string };

const STATE_KEY = 'app/pokedex/0cbaa92114907a941fbc722540eb313ea95f156036629d74038cd0ae5f1a1bd0';
const POLL_MS = 3000;

function normalizeRows(payload: any): Row[] {
  // Preferred shape: { pokemons: "[ {id,name,tx}, ... ]" }
  const raw = (payload as any).value.pokemons;
  const arr = JSON.parse(raw)
  return arr.map((item: any, idx: number) => ({
    id: typeof item?.id === 'number' ? item.id : idx,
    name: String(item?.name ?? ''),
    tx: String(item?.tx ?? ''),
  }));
}

export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => new URLSearchParams({ key: STATE_KEY }).toString(), []);

  const fetchState = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/state?${query}`, { cache: 'no-store' });
      const text = await res.text();
      let json: any;
      try { json = JSON.parse(text); } catch { json = text; }
      const next = normalizeRows(json);
      setRows(next);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch state');
    }
  }, [query]);

  useEffect(() => {
    setLoading(true);
    fetchState().finally(() => setLoading(false));
    const id = setInterval(fetchState, POLL_MS);
    return () => clearInterval(id);
  }, [fetchState]);

  const handleCatch = useCallback(async () => {
    try {
      const body = { command: JSON.stringify({ type: 'catch', value: { msg: 'hi' } }) };
      const res = await fetch('/api/tx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      // To keep UI responsive, just refresh state; log response to console
      const text = await res.text();
      try { console.log('Catch response (JSON):', JSON.parse(text)); } catch { console.log('Catch response (text):', text); }
      fetchState();
    } catch (e) {
      console.error('Catch failed:', e);
      setError('Catch request failed');
    }
  }, [fetchState]);

  return (
    <main>
      <h1>Pokedex</h1>
      <button onClick={handleCatch}>Catch</button>
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      {loading && <p>Loading…</p>}

      <table>
        <caption>Pokedex</caption>
        <thead>
          <tr>
            <th>name</th>
            <th>tx</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td className="mono">{r.tx}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={2}>
                <em>No entries yet.</em>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
