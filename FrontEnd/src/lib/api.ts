export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendfim.vercel.app';



type FetchOptions = RequestInit & {
  token?: string | null;
  data?: unknown;
};

async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { token, data, ...customConfig } = options;

  const isFormData = customConfig.body instanceof FormData;

  const headers: HeadersInit = {};
  if (!isFormData && data !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: data ? 'POST' : (customConfig.method || 'GET'),
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (data !== undefined) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      const text = await response.text();
      let message = response.statusText;
      try {
        const err = JSON.parse(text);
        message = err.message || err.error || message;
      } catch {}
      throw new Error(`${response.status}: ${message || 'Erro desconhecido'}`);
    }
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (error: any) {
    const msg = String(error?.message || '').toLowerCase();
    if (msg.includes('failed to fetch') || msg.includes('network') || msg.includes('abort')) {
      throw new Error('Servidor indisponível ou falha de rede. Tente novamente.');
    }
    throw error;
  }
}

export default apiFetch;

export async function apiGet(path: string, token?: string) {
  return apiFetch(path, { token })
}

export async function apiPost(path: string, body: any, token?: string) {
  return apiFetch(path, { token, data: body, method: 'POST' })
}
