// lib/header/user-type.ts
export interface User {
  userId?: string;
  googleId?: string;
  name?: string;
  email?: string;
  picture?: string;
  status?: string;
  unansweredCount?: number;
  [key: string]: any;
}
export const isValidUser = (u: any): u is User => !!u && (u.googleId || u.userId);
