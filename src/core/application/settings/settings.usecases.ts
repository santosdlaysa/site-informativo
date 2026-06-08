import type { SettingsRepository } from "@/core/domain/settings/settings.repository";
import type { SiteSettingsData } from "@/core/domain/settings/site-settings";

export class GetSettingsUseCase {
  constructor(private readonly repo: SettingsRepository) {}
  execute(): Promise<SiteSettingsData> {
    return this.repo.get();
  }
}

export class UpdateSettingsUseCase {
  constructor(private readonly repo: SettingsRepository) {}
  execute(data: Partial<SiteSettingsData>): Promise<void> {
    return this.repo.update(data);
  }
}
