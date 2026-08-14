import type { ReviewRepository } from "@/domain/repositories/review.repository";

export class GetListingReviewsUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  execute(listingId: string) {
    return this.reviewRepository.findByListingId(listingId);
  }
}
