
import { createClient } from '@supabase/supabase-js';

// Use the same URL and key as the auto-generated client
const SUPABASE_URL = "https://ykxgdznqdoyaytbsfhpk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlreGdkem5xZG95YXl0YnNmaHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwODEzMTUsImV4cCI6MjA2MTY1NzMxNX0.W_0wABGIZ918AixQLPPYUCUns24NDpIPLf4OaL8xYfs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
