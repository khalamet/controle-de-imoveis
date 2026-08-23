const SUPABASE_URL = "https://xxiswuhpgbifjshjmuvf.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraXN3dWhwZ2JpZmpzaGptdXZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5ODk4OTksImV4cCI6MjA5NDU2NTg5OX0.MfDgb2Ie-iuHtaSHOvI1w_lL8B5yqlSujJL-PMKhKGg";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);