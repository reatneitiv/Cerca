import { GetCurrentLocationUseCase } from "@/application/use-cases/get-current-location.use-case";
import { GetListingByIdUseCase } from "@/application/use-cases/get-listing-by-id.use-case";
import { GetListingsUseCase } from "@/application/use-cases/get-listings.use-case";
import { ExpoLocationRepository } from "@/infrastructure/repositories/expo-location.repository";
import { ApiListingRepository } from "@/infrastructure/repositories/listing.repository";

const repository = new ApiListingRepository();
const locationRepository = new ExpoLocationRepository();

export const getListingsUseCase = new GetListingsUseCase(repository);
export const getListingByIdUseCase = new GetListingByIdUseCase(repository);
export const getCurrentLocationUseCase = new GetCurrentLocationUseCase(
  locationRepository,
);
