export type Capacity = "customer" | "provider";

export type PlatformRole = "user" | "moderator" | "admin";

export interface Actor {
  readonly id: string;
  readonly capacities: readonly Capacity[];
  readonly platformRole: PlatformRole;
}

export function hasCapacity(actor: Actor, capacity: Capacity): boolean {
  return actor.capacities.includes(capacity);
}

export function canModerateListings(actor: Actor): boolean {
  return actor.platformRole === "moderator" || actor.platformRole === "admin";
}
