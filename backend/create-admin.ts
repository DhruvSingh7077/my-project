import * as bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const { data, error } = await supabase
    .from('admins')
    .insert([
      {
        username: 'superadmin',
        password: hashedPassword,
      },
    ])
    .select();

  if (error) console.error(error);
  else console.log('✅ Admin created:', data);
}

createAdmin();
