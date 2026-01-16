export type UpstreamConfig = {
  protocol: 'http' | 'https';
  host: string;
  port: number;
  prefix: string; // e.g. '/v1' or ''
};

export function getUpstreamConfig(): UpstreamConfig {
  const protocol = (process.env.UPSTREAM_PROTOCOL || 'http').toLowerCase() as 'http' | 'https';
  const host = process.env.UPSTREAM_HOST || '127.0.0.1';
  const port = Number(process.env.UPSTREAM_PORT || 5001);
  let prefix = process.env.UPSTREAM_PREFIX || '/v1';
  if (!prefix.startsWith('/')) prefix = '/' + prefix;
  if (prefix.endsWith('/')) prefix = prefix.slice(0, -1);
  return { protocol, host, port, prefix };
}

export function toUpstreamUrl(pathname: string): string {
  const { protocol, host, port, prefix } = getUpstreamConfig();
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${protocol}://${host}:${port}${prefix}${path}`;
}

export async function upstreamFetch(pathname: string, init?: RequestInit) {
  const url = toUpstreamUrl(pathname);
  return fetch(url, init);
}

