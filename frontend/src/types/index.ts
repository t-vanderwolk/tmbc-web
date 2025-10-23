export type Role = "ADMIN" | "MENTOR" | "MEMBER";

export type User = {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
};

export type Invite = {
  id: string;
  code: string;
  used: boolean;
  createdAt: string;
};

export type WaitlistEntry = {
  id: string;
  email: string;
  name?: string | null;
  status: "PENDING" | "APPROVED" | "INVITED";
  createdAt: string;
};
