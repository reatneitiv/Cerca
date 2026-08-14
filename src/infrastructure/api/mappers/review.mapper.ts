import type { Review } from "@/domain/entities/review.entity";
import type { ReviewApiResponse } from "@/infrastructure/api/dtos/review.dto";

export class ReviewMapper {
  static toDomain(review: ReviewApiResponse): Review {
    return {
      id: review.id,
      rating: review.rating,
      body: review.body,
      createdAt: review.createdAt,
    };
  }
}
