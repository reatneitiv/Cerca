import type { ListingRepository } from "@/domain/repositories/listing.repository";

export class GetListingByIdUseCase {
  constructor(private readonly repository: ListingRepository) {}

  execute(id: string) {
    return this.repository.findById(id);
  }
}
