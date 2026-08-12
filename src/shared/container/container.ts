import { GetListingByIdUseCase } from "@/src/application/use-cases/get-listing-by-id.use-case";
import { GetListingsUseCase } from "@/src/application/use-cases/get-listings.use-case";
import { GetCurrentLocationUseCase } from "@/src/application/use-cases/get-current-location.use-case";
import { ApiListingRepository } from "@/src/infrastructure/repositories/listing.repository";
import { ExpoLocationRepository } from "@/src/infrastructure/repositories/expo-location.repository";

const repository = new ApiListingRepository();
const locationRepository = new ExpoLocationRepository();

export const getListingsUseCase = new GetListingsUseCase(repository);
export const getListingByIdUseCase = new GetListingByIdUseCase(repository);
export const getCurrentLocationUseCase = new GetCurrentLocationUseCase(locationRepository);
