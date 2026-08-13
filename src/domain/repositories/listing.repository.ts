import type { ListingDetail, ListingSummary } from "@/domain/entities/listing.entity";

export interface ListingSearchParams {
  readonly lat: number;
  readonly lng: number;
  readonly query?: string;
  readonly radiusKm?: number;
  readonly limit?: number;
  readonly cursor?: string;
  readonly categoryId?: string;
}

export interface ListingPage {
  readonly items: ListingSummary[];
  readonly nextCursor: string | null;
}

export interface ListingRepository {
  findAll(params: ListingSearchParams): Promise<ListingPage>;
  findById(id: string): Promise<ListingDetail | null>;
}
