export interface ReviewApiResponse {
  id: string;
  rating: number;
  body: string;
  createdAt: string;
}

export type ReviewListApiResponse = ReviewApiResponse[] | { items: ReviewApiResponse[] };
