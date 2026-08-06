import { GetListingByIdUseCase } from "@/src/application/use-cases/get-listing-by-id.use-case";
import { GetListingsUseCase } from "@/src/application/use-cases/get-listings.use-case";

import { MockListingRepository } from "@/src/infrastructure/repositories/mock-listing.repository";

const repository = new MockListingRepository();

export const getListingsUseCase = new GetListingsUseCase(repository);
export const getListingByIdUseCase = new GetListingByIdUseCase(repository);