export interface SignInDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  displayName?: string;
  capacities?: Array<"customer" | "provider">;
}

export interface AuthResultDto {
  accessToken: string;
  refreshToken: string;
  actor: { id: string; capacities: string[]; platformRole: string };
}
