import type { AuthSession } from "../entities/AuthSession";

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  displayName?: string;
  capacities?: string[];
}

export interface AuthRepository {
  signIn(input: SignInInput): Promise<AuthSession>;

  signUp(input: SignUpInput): Promise<AuthSession>;

  signOut(): Promise<void>;

  refresh(): Promise<AuthSession>;
}
