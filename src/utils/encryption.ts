import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '@config/index';

export class PasswordUtils {
  // Hash da senha
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  // Verificar senha
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Gerar salt personalizado
  static async generateSalt(rounds: number = SALT_ROUNDS): Promise<string> {
    return await bcrypt.genSalt(rounds);
  }
}