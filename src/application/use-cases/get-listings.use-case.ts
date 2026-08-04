import type { Listing } from "@/src/domain/entities/listing.entity";
import type { ListingRepository } from "@/src/domain/repositories/listing.repository";

export class GetListingsUseCase {
  constructor(
    private readonly listingRepository: ListingRepository,
  ) {}

  async execute(): Promise<Listing[]> {
    return this.listingRepository.findAll();
  }
}