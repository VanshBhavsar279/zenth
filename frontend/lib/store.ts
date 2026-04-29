'use client';

import { create } from 'zustand';
import type { ContactInfo, ThemeSettings } from './types';

interface ThemeState extends ThemeSettings {
  hydrated: boolean;
  setTheme: (t: Partial<ThemeSettings>) => void;
  setHydrated: (v: boolean) => void;
  applyCssVariables: () => void;
}

const defaultTheme: ThemeSettings = {
  primaryColor: '#0A0A0A',
  secondaryColor: '#E8FF00',
  logoUrl: '',
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  ...defaultTheme,
  hydrated: false,
  setTheme: (t) =>
    set((s) => ({
      ...s,
      ...t,
      hydrated: true,
    })),
  setHydrated: (v) => set({ hydrated: v }),
  applyCssVariables: () => {
    if (typeof document === 'undefined') return;
    const { primaryColor, secondaryColor } = get();
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--color-secondary', secondaryColor);
  },
}));

interface ContactState {
  contact: ContactInfo | null;
  hydrated: boolean;
  setContact: (c: ContactInfo | null) => void;
  setHydrated: (v: boolean) => void;
}

export const useContactStore = create<ContactState>((set) => ({
  contact: null,
  hydrated: false,
  setContact: (c) => set({ contact: c, hydrated: true }),
  setHydrated: (v) => set({ hydrated: v }),
}));

interface AdminAuthState {
  checked: boolean;
  authenticated: boolean;
  email: string | null;
  setAuth: (authenticated: boolean, email?: string | null) => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  checked: false,
  authenticated: false,
  email: null,
  setAuth: (authenticated, email = null) =>
    set({
      authenticated,
      email: email ?? null,
      checked: true,
    }),
}));
