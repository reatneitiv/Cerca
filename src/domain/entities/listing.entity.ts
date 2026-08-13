import type { Money } from "@/domain/value-objects/money.value-object";

export type ListingStatus =
  | "draft"
  | "published"
  | "paused"
  | "under_review"
  | "removed";

export interface ListingSummary {
  readonly id: string;
  readonly title: string;
  readonly categoryId: string;
  readonly priceFrom: Money | null;
  readonly status: ListingStatus;
  readonly ratingAvg: number;
  readonly ratingCount: number;
  readonly distanceMeters: number;
}

//Summary returned by the listings search endpoint.
export type Listing = ListingSummary;

export interface ListingDetail {
  readonly id: string;
  readonly ownerId: string;
  readonly categoryId: string;
  readonly title: string;
  readonly description: string;
  readonly pricing: Record<string, unknown>;
  readonly priceFrom: Money | null;
  readonly status: ListingStatus;
  readonly ratingAvg: number;
  readonly ratingCount: number;
  readonly createdAt: string;
}
