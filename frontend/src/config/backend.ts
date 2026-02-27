function normalizeBaseUrl(value: string | undefined): string {
  if (!value) return '';
  return value.trim().replace(/\/+$/, '');
}

export const publicBaseUrl = normalizeBaseUrl(
  import.meta.env.VITE_PUBLIC_BASE_URL,
);

export function withBackendBase(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return publicBaseUrl ? `${publicBaseUrl}${normalizedPath}` : normalizedPath;
}

export function backendWispUrl(): string {
  if (!publicBaseUrl) {
    const wsProto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProto}//${location.host}/wisp/`;
  }

  const wsBase = publicBaseUrl
    .replace(/^https:/i, 'wss:')
    .replace(/^http:/i, 'ws:');
  return `${wsBase}/wisp/`;
}
