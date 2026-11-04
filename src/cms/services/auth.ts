import { useSyncExternalStore } from 'react';

export type AdminRole = 'admin' | 'editor' | 'viewer';

export interface AdminSession {
  name: string;
  email: string;
  role: AdminRole;
  mode: 'server' | 'development';
}

export interface AuthApi {
  login(email: string, password: string): Promise<{ name: string; email: string; role: string }>;
  whoAmI(): Promise<{ name: string; email: string; role: string } | null>;
  logout(): Promise<void>;
  changePassword(current: string, next: string): Promise<void>;
}

/** `local` runs the CMS in browser storage with no backend. The default is the real API. */
export const isLocalBackend = () => import.meta.env.VITE_CMS_BACKEND === 'local';

const SESSION_KEY = 'knowza.cms.devSession';

// Development sign-in exists only in the explicit local-storage mode, where there is nothing to protect.
export const isDevAuthAvailable = () => isLocalBackend();

const readDevSession = (): AdminSession | null => {
  if (!isDevAuthAvailable()) return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
};

let session = readDevSession();
let api: AuthApi | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

const setSession = (next: AdminSession | null) => {
  session = next;
  emit();
};

export const registerAuthApi = (value: AuthApi) => {
  api = value;
};

export const getCurrentSession = () => session;

export function devSignIn(name: string, email: string, role: AdminRole) {
  if (!isDevAuthAvailable()) throw new Error('Development sign-in is disabled in this build.');
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name, email, role, mode: 'development' }));
  setSession({ name, email, role, mode: 'development' });
}

const toSession = (user: { name: string; email: string; role: string }): AdminSession => ({
  name: user.name,
  email: user.email,
  role: user.role as AdminRole,
  mode: 'server',
});

export async function signIn(email: string, password: string) {
  if (!api) throw new Error('Sign-in is not available.');
  setSession(toSession(await api.login(email, password)));
}

/** Restores the session from the server's HTTP-only cookie. */
export async function restoreSession() {
  if (!api) return;
  const user = await api.whoAmI();
  setSession(user ? toSession(user) : null);
}

export async function signOut() {
  // The admin closes first, so no screen is still requesting data as the session ends.
  sessionStorage.removeItem(SESSION_KEY);
  setSession(null);
  if (api) await api.logout().catch(() => undefined);
}

export async function changePassword(current: string, next: string) {
  if (!api) throw new Error('Passwords are managed by the backend.');
  await api.changePassword(current, next);
}

export function useSession() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => session
  );
}

export const canEdit = (role?: AdminRole) => role === 'admin' || role === 'editor';
export const canPublish = (role?: AdminRole) => role === 'admin';
