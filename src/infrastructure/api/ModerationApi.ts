import type { HttpClient } from "@/infrastructure/http/HttpClient";

export type ListingModerationAction = "under_review" | "removed";

export class ModerationApi {
  constructor(private readonly httpClient: HttpClient) {}

  moderateListing(id: string, action: ListingModerationAction, reason: string): Promise<unknown> {
    return this.httpClient.post(`/v1/listings/${id}/moderate`, { action, reason });
  }
}
