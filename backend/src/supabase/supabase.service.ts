import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient<any>;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_KEY');

    if (!url || !key) {
      throw new Error('❌ Missing Supabase credentials in .env');
    }

    this.supabase = createClient<any>(url, key);
  }

  getClient() {
    return this.supabase;
  }
}
