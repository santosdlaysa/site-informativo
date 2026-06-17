import {
  AuthUser,
  CreateUserData,
  UpdateProfileData,
  UserListItem,
  UserProfile,
  UserRepository,
} from "@/core/domain/user/user.repository";
import { normalizeUserRole } from "@/core/domain/user/user-role";
import { prisma } from "../prisma";

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      passwordChangeRequired: user.passwordChangeRequired,
      role: normalizeUserRole(user.role),
    };
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      passwordChangeRequired: user.passwordChangeRequired,
      role: normalizeUserRole(user.role),
    };
  }

  async findProfileById(id: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
    };
  }

  async updateProfile(id: string, data: UpdateProfileData): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { name: data.name, bio: data.bio, avatar: data.avatar },
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { passwordHash, passwordChangeRequired: false },
    });
  }

  async listAll(): Promise<UserListItem[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return users.map((user) => ({ ...user, role: normalizeUserRole(user.role) }));
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }

  async create(data: CreateUserData): Promise<UserListItem> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        passwordChangeRequired: data.passwordChangeRequired ?? false,
        role: data.role,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return { ...user, role: normalizeUserRole(user.role) };
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
