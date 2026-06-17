import { UserRepository } from "@/core/domain/user/user.repository";
import type { UserRole } from "@/core/domain/user/user-role";
import { PasswordHasher } from "../ports/password-hasher";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordChangeRequired: boolean;
}

/**
 * Valida e-mail + senha. Retorna o usuário (sem dados sensíveis) quando válido,
 * ou null caso contrário — sem distinguir "e-mail inexistente" de "senha errada".
 */
export class AuthenticateUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(email: string, password: string): Promise<AuthenticatedUser | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.users.findByEmail(normalizedEmail);
    if (!user) return null;

    const ok = await this.hasher.compare(password, user.passwordHash);
    if (!ok) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      passwordChangeRequired: user.passwordChangeRequired,
    };
  }
}
