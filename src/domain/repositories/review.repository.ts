import type { Review } from "@/domain/entities/review.entity";

export interface ReviewRepository {
  findByListingId(listingId: string): Promise<Review[]>;
}
