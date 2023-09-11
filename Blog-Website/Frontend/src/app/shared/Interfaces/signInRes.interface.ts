import { User } from './user';

export interface SignInRes {
  access_token: string;
  accessExpiry: string;
  refresh_token: string;
  refreshExpiry: string;
  user: User;
}
