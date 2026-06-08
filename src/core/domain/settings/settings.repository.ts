import type { SiteSettingsData } from "./site-settings";

export interface SettingsRepository {
  get(): Promise<SiteSettingsData>;
  update(data: Partial<SiteSettingsData>): Promise<void>;
}
