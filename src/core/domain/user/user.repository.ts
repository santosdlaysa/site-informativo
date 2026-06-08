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
  avatar: string | null;
}

export interface UpdateProfileData {
  name: string;
  bio: string | null;
  avatar: string | null;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

/** Porta do repositório de usuários. */
export interface UserRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
  findProfileById(id: string): Promise<UserProfile | null>;
  updateProfile(id: string, data: UpdateProfileData): Promise<void>;
  listAll(): Promise<UserListItem[]>;
  count(): Promise<number>;
  create(data: CreateUserData): Promise<UserListItem>;
  delete(id: string): Promise<void>;
}
