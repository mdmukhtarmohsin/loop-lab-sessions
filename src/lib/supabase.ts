
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
