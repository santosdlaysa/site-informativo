export const USER_ROLES = ["admin", "editor", "viewer"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  admin: "Administrador",
  editor: "Pode editar",
  viewer: "Apenas visualizar",
};

export function isUserRole(value: string | undefined | null): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}

export function normalizeUserRole(value: string | undefined | null): UserRole {
  return isUserRole(value) ? value : "editor";
}

