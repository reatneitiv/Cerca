import type {
    SignInInput,
    SignUpInput,
} from "@/domain/auth/repositories/AuthRepository";

import type { AuthSession } from "@/domain/auth/entities/AuthSession";

import type { HttpClient } from "@/infrastructure/http/HttpClient";

export class AuthApi {
  constructor(private readonly httpClient: HttpClient) {}

  async signIn(input: SignInInput): Promise<AuthSession> {
    return this.httpClient.post<AuthSession>("/v1/auth/sign-in", input);
  }

  async signUp(input: SignUpInput): Promise<AuthSession> {
    return this.httpClient.post<AuthSession>("/v1/auth/sign-up", input);
  }

  async signOut(): Promise<void> {
    await this.httpClient.post("/v1/auth/sign-out");
  }

  async refresh(): Promise<AuthSession> {
    return this.httpClient.post<AuthSession>("/v1/auth/refresh");
  }
}
