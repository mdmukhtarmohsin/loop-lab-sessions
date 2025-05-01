
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and anon key
// In production, these should come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a mock client for development if credentials are missing
const createSupabaseClient = () => {
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    
    // Return a mock client that won't break the app during development
    // This allows the app to load even without proper Supabase credentials
    return {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signOut: async () => {},
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Supabase not configured') }),
            order: () => ({ data: [], error: null }),
            limit: () => ({ data: [], error: null }),
          }),
          order: () => ({ data: [], error: null }),
        }),
        insert: () => ({
          select: () => ({
            single: async () => ({ data: null, error: new Error('Supabase not configured') })
          })
        }),
        delete: () => ({
          eq: () => ({ error: null })
        })
      })
    };
  }
};

export const supabase = createSupabaseClient();

export type UserProfile = {
  id: string;
  username: string;
  created_at: string;
  avatar_url?: string;
};

export type JamRoomData = {
  id: string;
  title: string;
  bpm: number;
  key: string;
  is_public: boolean;
  host_id: string;
  host_name: string;
  created_at: string;
};

export type TrackData = {
  id: string;
  name: string;
  audio_url: string;
  user_id: string;
  user_name: string;
  jam_room_id: string;
  created_at: string;
};
