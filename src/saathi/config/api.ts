/**
 * Centralized API & WebSocket Configuration for SAATHI-AI
 * Supports local development with Vite proxy and production deployments.
 */

export const getApiBaseUrl = (): string => {
  const envUrl = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SAATHI_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.replace(/\/+$/, '');
  }

  // In browser, use relative base "" so Vite proxy or same-origin routing handles /api/* seamlessly
  if (typeof window !== 'undefined') {
    return '';
  }

  return 'http://127.0.0.1:8000';
};

export const getWebSocketUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const envWs = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SAATHI_WS_URL;

  if (envWs && typeof envWs === 'string' && envWs.trim() !== '') {
    const baseWs = envWs.replace(/\/+$/, '');
    return `${baseWs}${cleanPath}`;
  }

  // Derive WebSocket URL from VITE_SAATHI_API_URL if configured for remote backend (e.g. Render)
  const envApiUrl = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SAATHI_API_URL;
  if (envApiUrl && typeof envApiUrl === 'string' && envApiUrl.trim() !== '') {
    const wsBase = envApiUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:').replace(/\/+$/, '');
    return `${wsBase}${cleanPath}`;
  }

  if (typeof window !== 'undefined') {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Use the current host (which Vite proxies to 127.0.0.1:8000 via ws: true)
    return `${wsProtocol}//${window.location.host}${cleanPath}`;
  }

  return `ws://127.0.0.1:8000${cleanPath}`;
};
