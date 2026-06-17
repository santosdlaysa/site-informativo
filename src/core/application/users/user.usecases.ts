import { ConflictError, ValidationError } from "@/core/domain/shared/errors";
import { UserListItem, UserRepository } from "@/core/domain/user/user.repository";
import { normalizeUserRole, type UserRole } from "@/core/domain/user/user-role";
import { PasswordHasher } from "../ports/password-hasher";

const MAX_USERS = 3;
const TEMPORARY_PASSWORD = "teste";
const HIDDEN_EDITOR_EMAILS = new Set(["admin@meublog", "admin@meublog.com"]);

function isVisibleEditor(user: UserListItem): boolean {
  return !HIDDEN_EDITOR_EMAILS.has(user.email.trim().toLowerCase());
}

export class ListUsersUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(): Promise<UserListItem[]> {
    const users = await this.users.listAll();
    return users.filter(isVisibleEditor);
  }
}

export class CreateUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(
    name: string,
    email: string,
    password: string,
    role: UserRole = "editor",
  ): Promise<UserListItem> {
    const count = (await this.users.listAll()).filter(isVisibleEditor).length;
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
      passwordChangeRequired: password === TEMPORARY_PASSWORD,
      role: normalizeUserRole(role),
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

export class GetUserSecurityUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(id: string): Promise<{ passwordChangeRequired: boolean } | null> {
    const user = await this.users.findById(id);
    if (!user) return null;
    return { passwordChangeRequired: user.passwordChangeRequired };
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
