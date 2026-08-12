import type { ListingStatus } from "@/domain/entities/listing.entity";

export type ListingStatusApi = ListingStatus;
export interface MoneyApiResponse { amountMinor: number; currency: string; }

export interface ListingSearchItemApiResponse {
  id: string;
  title: string;
  categoryId: string;
  priceFrom: MoneyApiResponse | null;
  status: ListingStatusApi;
  ratingAvg: number;
  ratingCount: number;
  distanceMeters: number;
}

export interface ListingApiResponse {
  id: string;
  ownerId: string;
  categoryId: string;
  title: string;
  description: string;
  pricing: Record<string, unknown>;
  priceFrom: MoneyApiResponse | null;
  status: ListingStatusApi;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
}

export interface ListingListApiResponse {
  items: ListingSearchItemApiResponse[];
  nextCursor: string | null;
}
