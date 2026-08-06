import type { Listing } from "@/src/domain/entities/listing.entity";

export interface ListingRepository {
  findAll(): Promise<Listing[]>;
  findById(id: string): Promise<Listing | null>;
}