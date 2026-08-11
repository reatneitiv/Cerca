import type {
    AuthRepository,
    SignInInput,
    SignUpInput,
} from "@/domain/auth/repositories/AuthRepository";

import type { AuthSession } from "@/domain/auth/entities/AuthSession";

import { AuthApi } from "@/infrastructure/auth/api/AuthApi";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly authApi: AuthApi) {}

  async signIn(input: SignInInput): Promise<AuthSession> {
    return this.authApi.signIn(input);
  }

  async signUp(input: SignUpInput): Promise<AuthSession> {
    return this.authApi.signUp(input);
  }

  async signOut(): Promise<void> {
    await this.authApi.signOut();
  }

  async refresh(): Promise<AuthSession> {
    return this.authApi.refresh();
  }
}
