import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] 環境變數未設定（VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY），排行榜功能將無法使用。')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
