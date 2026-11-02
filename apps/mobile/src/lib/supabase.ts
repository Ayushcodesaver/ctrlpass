// Hermes' URL props are getter-only; supabase-js assigns url.protocol — polyfill first
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV, isSupabaseConfigured } from '../config/env';

const url = isSupabaseConfigured() ? ENV.SUPABASE_URL : 'https://example.supabase.co';
const key = isSupabaseConfigured() ? ENV.SUPABASE_ANON_KEY : 'public-anon-placeholder';

export const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
