export const ROLES = ['ADMIN', 'MENTOR', 'MEMBER'] as const;

export type Role = (typeof ROLES)[number];

export const isRole = (value: string | undefined): value is Role => {
  return !!value && ROLES.includes(value as Role);
};
