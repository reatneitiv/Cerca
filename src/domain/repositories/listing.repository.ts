import type { ListingDetail, ListingSummary } from "@/src/domain/entities/listing.entity";

export interface ListingSearchParams {
  readonly lat: number;
  readonly lng: number;
  readonly query?: string;
  readonly radiusKm?: number;
  readonly limit?: number;
}

export interface ListingRepository {
  findAll(params: ListingSearchParams): Promise<ListingSummary[]>;
  findById(id: string): Promise<ListingDetail | null>;
}
