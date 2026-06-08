import { NotFoundError } from "@/core/domain/shared/errors";
import {
  UpdateProfileData,
  UserProfile,
  UserRepository,
} from "@/core/domain/user/user.repository";

export class GetProfileUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(id: string): Promise<UserProfile> {
    const profile = await this.users.findProfileById(id);
    if (!profile) throw new NotFoundError("User", id);
    return profile;
  }
}

export class UpdateProfileUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(id: string, data: UpdateProfileData): Promise<void> {
    const existing = await this.users.findProfileById(id);
    if (!existing) throw new NotFoundError("User", id);
    await this.users.updateProfile(id, {
      name: data.name.trim(),
      bio: data.bio?.trim() ? data.bio.trim() : null,
      avatar: data.avatar ?? null,
    });
  }
}
