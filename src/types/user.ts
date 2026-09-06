export type UserRole = "ADMIN" | "JUDGE" | "TEACHER";

export type UserStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}