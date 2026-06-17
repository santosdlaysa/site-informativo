import { ConflictError, ValidationError } from "@/core/domain/shared/errors";
import { UserListItem, UserRepository } from "@/core/domain/user/user.repository";
import { PasswordHasher } from "../ports/password-hasher";

const MAX_USERS = 3;

export class ListUsersUseCase {
  constructor(private readonly users: UserRepository) {}

  execute(): Promise<UserListItem[]> {
    return this.users.listAll();
  }
}

export class CreateUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(name: string, email: string, password: string): Promise<UserListItem> {
    const count = await this.users.count();
    if (count >= MAX_USERS) {
      throw new ValidationError(`Limite de ${MAX_USERS} editores atingido.`);
    }

    const existing = await this.users.findByEmail(email.trim().toLowerCase());
    if (existing) throw new ConflictError("Já existe um editor com este e-mail.");

    const passwordHash = await this.hasher.hash(password);
    return this.users.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    });
  }
}

export class DeleteUserUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(id: string, currentUserId: string, currentUserRole: string): Promise<void> {
    if (currentUserRole !== "admin") {
      throw new ValidationError("Apenas o administrador pode remover editores.");
    }
    if (id === currentUserId) {
      throw new ValidationError("Você não pode remover sua própria conta.");
    }
    await this.users.delete(id);
  }
}

export class UpdateOwnPasswordUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.users.findById(userId);
    if (!user) throw new ValidationError("Usuário não encontrado.");

    const currentPasswordMatches = await this.hasher.compare(currentPassword, user.passwordHash);
    if (!currentPasswordMatches) {
      throw new ValidationError("Senha atual incorreta.");
    }

    const passwordHash = await this.hasher.hash(newPassword);
    await this.users.updatePassword(userId, passwordHash);
  }
}
