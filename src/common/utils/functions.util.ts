import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';

@Injectable()
export class UtilFunctions {
  async hashPassword(password: string): Promise<string> {
    return await hash(password);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await verify(hashedPassword, password);
  }
}
