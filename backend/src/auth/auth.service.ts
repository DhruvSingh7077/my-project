import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import * as bcrypt from 'bcrypt';
interface Admin {
  id: string;
  username: string;
  password: string;
  created_at: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async validateAdmin(username: string, password: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .limit(1);

    const admins = data as Admin[] | null;
    if (error || !admins || admins.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const admin: Admin = admins[0];

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return admin;
  }

  async login(username: string, password: string) {
    const admin = await this.validateAdmin(username, password);

    // ✅ Explicitly type payload to avoid `any`
    const payload: { sub: string; username: string } = {
      sub: admin.id,
      username: admin.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
