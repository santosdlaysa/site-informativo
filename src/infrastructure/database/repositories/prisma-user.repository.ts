import {
  AuthUser,
  UpdateProfileData,
  UserProfile,
  UserRepository,
} from "@/core/domain/user/user.repository";
import { prisma } from "../prisma";

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
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
    };
  }

  async updateProfile(id: string, data: UpdateProfileData): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { name: data.name, bio: data.bio },
    });
  }
}
