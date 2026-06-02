export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

/** Porta do repositório de usuários (apenas o necessário para autenticação). */
export interface UserRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
}
