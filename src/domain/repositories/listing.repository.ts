import type { Listing } from "../entities/listing.entity";

export interface ListingRepository {
  findAll(): Promise<Listing[]>;
  findById(id: string): Promise<Listing | null>;
}