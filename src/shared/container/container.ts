import { GetListingsUseCase } from "@/src/application/use-cases/get-listings.use-case";
import { MockListingRepository } from "@/src/infrastructure/repositories/mock-listing.repository";

const repository = new MockListingRepository();

export const getListingsUseCase = new GetListingsUseCase(repository);