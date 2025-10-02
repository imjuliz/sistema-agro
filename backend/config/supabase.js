import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// 1. Carrega variáveis de ambiente imediatamente
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL ou SUPABASE_ANON_KEY não definidos!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
