import type { ListingSearchParams, ListingRepository } from "@/src/domain/repositories/listing.repository";

export class GetListingsUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(params: ListingSearchParams) {
    return this.listingRepository.findAll(params);
  }
}
