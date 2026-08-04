import type { Listing } from "@/src/domain/entities/listing.entity";
import type { ListingRepository } from "@/src/domain/repositories/listing.repository";
import { listingsMock } from "@/src/mocks/listings.mock";

export class MockListingRepository implements ListingRepository {
  async findAll(): Promise<Listing[]> {
    return listingsMock;
  }

  async findById(id: string): Promise<Listing | null> {
    const listing = listingsMock.find(item => item.id === id);

    return listing ?? null;
  }
}