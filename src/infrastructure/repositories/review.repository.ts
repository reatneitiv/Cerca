import type { Review } from "@/domain/entities/review.entity";
import type { ReviewRepository as ReviewRepositoryContract } from "@/domain/repositories/review.repository";
import { ApiClient } from "@/infrastructure/api/api-client";
import type { ReviewListApiResponse } from "@/infrastructure/api/dtos/review.dto";
import { ReviewMapper } from "@/infrastructure/api/mappers/review.mapper";
import { API_BASE_URL } from "@/infrastructure/config/api.config";

export class ApiReviewRepository implements ReviewRepositoryContract {
  private readonly apiClient = new ApiClient(API_BASE_URL);

  async findByListingId(listingId: string): Promise<Review[]> {
    const raw = await this.apiClient.get<ReviewListApiResponse>(`/listings/${listingId}/reviews`);
    const items = Array.isArray(raw) ? raw : raw.items;
    return items.map(ReviewMapper.toDomain);
  }
}
