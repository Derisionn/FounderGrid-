import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from a .env file. Expo inlines any `EXPO_PUBLIC_`-prefixed vars into
// `process.env` at build time (restart the dev server with `-c` after editing).
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// When the env vars are missing (e.g. no .env yet), createClient would throw at
// import time. Fall back to a stub that resolves every query to an "unconfigured"
// error so the rest of the app keeps rendering (and mock-data fallbacks kick in).
const isConfigured =
  typeof SUPABASE_URL === 'string' &&
  /^https?:\/\//.test(SUPABASE_URL) &&
  typeof SUPABASE_ANON_KEY === 'string' &&
  SUPABASE_ANON_KEY.length > 0;

const unconfiguredResult = {
  data: null,
  error: { message: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in env.js.' },
};

const makeStubChain = (): any => {
  const chain: any = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'then') {
          return (resolve: (v: unknown) => void) => resolve(unconfiguredResult);
        }
        return () => chain;
      },
    },
  );
  return chain;
};

const stubClient: any = {
  from: () => makeStubChain(),
  auth: {
    async getUser() {
      return { data: { user: null }, error: null };
    },
    async getSession() {
      return { data: { session: null }, error: null };
    },
    async signInWithOtp() {
      return { data: null, error: unconfiguredResult.error };
    },
    async verifyOtp() {
      return { data: null, error: unconfiguredResult.error };
    },
    async signInWithPassword() {
      // Mock successful sign-in so we can bypass login screen
      return { data: { session: {} }, error: null };
    },
    async signUp() {
      // Mock successful sign-up so we can bypass login screen
      return { data: { session: {} }, error: null };
    },
    async signOut() {
      return { error: null };
    },
    onAuthStateChange() {
      return { data: { subscription: { unsubscribe() {} } } };
    },
  },
};

export const supabase: SupabaseClient = isConfigured
  ? createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : (stubClient as SupabaseClient);

// Mock signed-in user — used as a last-resort fallback where a real id isn't
// available yet (e.g. mock-data screens before their auth migration).
export const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

// Real signed-in user id from the active session, or null when signed out.
export const getUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
};
