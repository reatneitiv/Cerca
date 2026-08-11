export type Capacity = "customer" | "provider";

export type PlatformRole = "user" | "moderator" | "admin";

export interface Actor {
  readonly id: string;
  readonly capacities: readonly Capacity[];
  readonly platformRole: PlatformRole;
}
