export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

/** Perfil público/editável do autor exibido no painel e nos posts. */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string | null;
}

export interface UpdateProfileData {
  name: string;
  bio: string | null;
}

/** Porta do repositório de usuários. */
export interface UserRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
  findProfileById(id: string): Promise<UserProfile | null>;
  updateProfile(id: string, data: UpdateProfileData): Promise<void>;
}
