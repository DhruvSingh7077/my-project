import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseKey = process.env.SUPABASE_KEY!;
// const supabase = createClient(supabaseUrl, supabaseKey);

@Injectable()
export class UserService {
  private readonly supabase: SupabaseClient<any>;
  private readonly table = 'users';

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration in .env');
    }

    this.supabase = createClient<any>(supabaseUrl, supabaseKey);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const result = await this.supabase
        .from(this.table)
        .insert([createUserDto])
        .select()
        .single();

      if (result.error) {
        console.error('Supabase insert error:', result.error);

        // Handle duplicate email
        if (result.error.code === '23505') {
          throw new ConflictException('Email already exists');
        }

        throw result.error;
      }

      console.log('Inserted user:', result.data);
      return result.data as User;
    } catch (err: unknown) {
      console.error('Error creating user:', err);
      if (err instanceof ConflictException) throw err;
      throw new InternalServerErrorException(
        (err as Error).message || 'Failed to create user',
      );
    }
  }
  async getUsers(search?: string): Promise<User[]> {
    try {
      let query = this.supabase.from(this.table).select('*');

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const result = await query;

      if (result.error) {
        console.error('Supabase getUsers error:', result.error);
        throw result.error;
      }
      return (result.data ?? []) as User[];
    } catch (err: unknown) {
      console.error('Error retrieving user:', err);
      throw new InternalServerErrorException(
        (err as Error).message || 'Failed to retrieve user',
      );
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const result = await this.supabase
        .from(this.table)
        .select('*')
        .eq('id', id)
        .single();

      if (result.error || !result.data) {
        console.error('Supabase getUserById error:', result.error);
        throw new NotFoundException('User not found');
      }

      return result.data as User;
    } catch (err: unknown) {
      console.error('Error deleting user:', err);
      throw new InternalServerErrorException(
        (err as Error).message || 'Failed to delete user',
      );
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      const result = await this.supabase
        .from(this.table)
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (result.error || !result.data) {
        console.error('Supabase deleteUser error:', result.error);
        throw new NotFoundException('User not found');
      }

      console.log('Deleted user:', result.data);
      return result.data as User;
    } catch (err: unknown) {
      console.error('Error deleting user:', err);
      throw new InternalServerErrorException(
        (err as Error).message || 'Failed to delete user',
      );
    }
  }
}
