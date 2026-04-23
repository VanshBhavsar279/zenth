import type { ContactInfo, Product, ProductCategory, ThemeSettings } from './types';

const base = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchJson<T>(
  path: string,
  options: RequestInit & { skipJson?: boolean } = {}
): Promise<T> {
  const res = await fetch(`${base()}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = await res.json();
      msg = body.message || JSON.stringify(body);
    } catch {
      /* ignore */
    }
    throw new Error(msg || `Request failed: ${res.status}`);
  }

  if (options.skipJson) return undefined as T;
  return res.json() as Promise<T>;
}

/** Theme — public */
export async function getTheme(): Promise<ThemeSettings> {
  return fetchJson<ThemeSettings>('/api/settings/theme');
}

/** Contact — public */
export async function getContact(): Promise<ContactInfo> {
  return fetchJson<ContactInfo>('/api/settings/contact');
}

/** Products — public */
export async function getProducts(params?: Record<string, string | string[] | undefined>) {
  const search = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined) return;
      if (Array.isArray(v)) v.forEach((x) => search.append(k, x));
      else search.set(k, v);
    });
  }
  const q = search.toString();
  return fetchJson<Product[]>(`/api/products${q ? `?${q}` : ''}`);
}

export async function getProductById(id: string): Promise<Product> {
  return fetchJson<Product>(`/api/products/${id}`);
}

/** Auth */
export async function loginAdmin(email: string, password: string) {
  return fetchJson<{ message: string; email: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutAdmin() {
  return fetchJson<{ message: string }>('/api/auth/logout', { method: 'POST' });
}

export async function authMe(): Promise<{ authenticated: boolean; email?: string }> {
  try {
    return await fetchJson<{ authenticated: boolean; email: string }>('/api/auth/me');
  } catch {
    return { authenticated: false };
  }
}

/** Admin products */
export async function getProductsAdmin(q?: string, category?: string) {
  const p = new URLSearchParams();
  if (q) p.set('q', q);
  if (category) p.set('category', category);
  const qs = p.toString();
  return fetchJson<Product[]>(`/api/products/admin/all${qs ? `?${qs}` : ''}`);
}

export async function createProduct(body: Partial<Product>) {
  return fetchJson<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateProduct(id: string, body: Partial<Product>) {
  return fetchJson<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteProduct(id: string) {
  return fetchJson<{ message: string }>(`/api/products/${id}`, { method: 'DELETE' });
}

export async function patchProductStock(id: string, colorId: string, stock: number) {
  return fetchJson<Product>(`/api/products/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ colorId, stock }),
  });
}

export async function toggleProductVisibility(id: string) {
  return fetchJson<Product>(`/api/products/${id}/visibility`, { method: 'PATCH' });
}

export async function toggleProductFeatured(id: string) {
  return fetchJson<Product>(`/api/products/${id}/featured`, { method: 'PATCH' });
}

/** Admin settings */
export async function updateTheme(payload: Partial<ThemeSettings>) {
  return fetchJson<ThemeSettings>('/api/settings/theme', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updateContact(payload: Partial<ContactInfo>) {
  return fetchJson<ContactInfo>('/api/settings/contact', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function uploadImage(file: File): Promise<{ url: string; publicId?: string }> {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${base()}/api/upload`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || 'Upload failed');
  }
  return res.json();
}
