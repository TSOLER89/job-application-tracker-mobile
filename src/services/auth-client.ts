import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { fetch as transport } from 'expo/fetch';
import { readApiError } from '@/utils/api-error';

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:5250').replace(/\/$/, '');
export type Account = { id: string; email: string };
type Session = { user: Account | null; csrfToken: string | null; accessToken: string | null };
const native = Platform.OS !== 'web';
const storageKey = 'jobtrack.session.' + API_BASE_URL.replace(/[^a-z0-9._-]/gi, '_');
let token: string | null = null;
let csrfToken: string | null = null;
let authGeneration = 0;
let sessionRequest: Promise<Session> | null = null;
const expiredListeners = new Set<() => void>();

export function onSessionExpired(listener: () => void) {
  expiredListeners.add(listener);
  return () => { expiredListeners.delete(listener); };
}

export async function storeToken(value: string | null) {
  if (native) {
    try {
      if (value) await SecureStore.setItemAsync(storageKey, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
      else await SecureStore.deleteItemAsync(storageKey);
    } finally { if (!value) token = null; }
  }
  token = value;
}

async function loadSession(): Promise<Session> {
  const generation = authGeneration;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await transport(`${API_BASE_URL}/api/auth/session`, {
      credentials: native ? 'omit' : 'include', signal: controller.signal,
      headers: native ? { 'X-Auth-Mode': 'bearer', ...(token ? { Authorization: `Bearer ${token}` } : {}) } : {},
    });
    if (!response.ok) throw new Error(await readApiError(response, 'Kunde inte kontrollera inloggningen.'));
    const session: Session = await response.json();
    if (generation === authGeneration) csrfToken = session.csrfToken;
    return session;
  } finally { clearTimeout(timeout); }
}

export function fetchSession(): Promise<Session> {
  if (!sessionRequest) sessionRequest = loadSession().finally(() => { sessionRequest = null; });
  return sessionRequest;
}

export async function restoreAccount() {
  const generation = authGeneration;
  if (native) {
    const saved = await SecureStore.getItemAsync(storageKey);
    if (generation !== authGeneration) return null;
    token = saved;
  }
  const session = await fetchSession();
  if (!session.user && token && generation === authGeneration) {
    // A revoked token cannot authenticate again, even if device storage is temporarily unavailable.
    await storeToken(null).catch(() => {});
  }
  return session.user;
}

export async function apiFetch(url: string, options: Parameters<typeof transport>[1] = {}) {
  const generation = authGeneration;
  if (new URL(url).origin !== new URL(API_BASE_URL).origin) throw new Error('Ogiltig API-adress.');
  const headers = new Headers(options.headers);
  if (native) {
    headers.set('X-Auth-Mode', 'bearer');
    if (token) headers.set('Authorization', `Bearer ${token}`);
  } else if (!['GET', 'HEAD', 'OPTIONS'].includes(options.method ?? 'GET')) {
    if (!csrfToken) await fetchSession();
    headers.set('X-CSRF-TOKEN', csrfToken!);
  }
  const response = await transport(url, { ...options, headers, credentials: native ? 'omit' : 'include' });
  if (generation === authGeneration && response.status === 401 && !url.endsWith('/login') && !url.endsWith('/register')) {
    csrfToken = null;
    authGeneration++;
    expiredListeners.forEach(listener => listener());
  }
  return response;
}

export async function authenticate(action: 'login' | 'register', email: string, password: string) {
  if (!native) {
    await fetchSession();
    if (!csrfToken) await fetchSession();
  }
  authGeneration++;
  const response = await apiFetch(`${API_BASE_URL}/api/auth/${action}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  if (!response.ok) throw new Error(await readApiError(response, 'Kunde inte logga in.'));
  const session: Session = await response.json();
  if (!session.user || (native && !session.accessToken)) throw new Error('Serverns inloggningssvar var ogiltigt.');
  csrfToken = session.csrfToken;
  await storeToken(session.accessToken);
  return session.user;
}

export async function signOut() {
  authGeneration++;
  const response = await apiFetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' });
  if (!response.ok) throw new Error(await readApiError(response, 'Kunde inte logga ut. Försök igen.'));
  csrfToken = null;
  // The server has revoked this session; don't leave the UI signed in if local deletion fails.
  await storeToken(null).catch(() => {});
}

export function authenticatedImageSource(uri: string) {
  const source: { uri: string; headers?: Record<string, string> } = { uri };
  if (native && token && uri.startsWith(`${API_BASE_URL}/uploads/`))
    source.headers = { Authorization: `Bearer ${token}` };
  return source;
}
