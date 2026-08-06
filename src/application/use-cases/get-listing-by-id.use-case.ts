import type { Listing } from "@/src/domain/entities/listing.entity";
import type { ListingRepository } from "@/src/domain/repositories/listing.repository";

export class GetListingByIdUseCase {
  constructor(private readonly repository: ListingRepository) {}

  execute(id: string): Promise<Listing | null> {
    return this.repository.findById(id);
  }
}