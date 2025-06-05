import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sgwgubjtwfrlgufljsyg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnd2d1Ymp0d2ZybGd1Zmxqc3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NDcwNDEsImV4cCI6MjA2NDAyMzA0MX0.SkRW5dJ3qTGC8bNFiL2bUTowsRPQxbudyT5gJF1COjg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);