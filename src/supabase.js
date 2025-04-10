import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hxzcbifllmwvlpyuiznh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4emNiaWZsbG13dmxweXVpem5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMjY3NTEsImV4cCI6MjA1MTkwMjc1MX0.DewIZj6QzXztnJfUIJ5OiRp1F3kp26_v4ZxdUEqI6Xw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// refresh session
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})