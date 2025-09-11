export interface User {
  id: string; // UUID or serial depending on your Supabase schema
  full_name: string;
  email: string;
  password: string;
  role?: string; // optional
  phone?: string; // optional
  status?: string; // optional
  created_at?: string; // Supabase auto timestamp
}
