import { GetCategoriesUseCase } from "@/application/use-cases/get-categories.use-case";
import { GetCurrentLocationUseCase } from "@/application/use-cases/get-current-location.use-case";
import { GetListingByIdUseCase } from "@/application/use-cases/get-listing-by-id.use-case";
import { GetListingsUseCase } from "@/application/use-cases/get-listings.use-case";
import { GetListingReviewsUseCase } from "@/application/use-cases/get-listing-reviews.use-case";
import { ApiCategoryRepository } from "@/infrastructure/repositories/category.repository";
import { ExpoLocationRepository } from "@/infrastructure/repositories/expo-location.repository";
import { ApiListingRepository } from "@/infrastructure/repositories/listing.repository";
import { ApiReviewRepository } from "@/infrastructure/repositories/review.repository";

const repository = new ApiListingRepository();
const categoryRepository = new ApiCategoryRepository();
const locationRepository = new ExpoLocationRepository();
const reviewRepository = new ApiReviewRepository();

export const getListingsUseCase = new GetListingsUseCase(repository);
export const getListingByIdUseCase = new GetListingByIdUseCase(repository);
export const getCurrentLocationUseCase = new GetCurrentLocationUseCase(locationRepository);
export const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
export const getListingReviewsUseCase = new GetListingReviewsUseCase(reviewRepository);
