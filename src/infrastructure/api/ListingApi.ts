import type {
  ListingDetail,
  ListingSummary,
  PaginatedResponse,
} from "@/domain/entities/listing.entity";
import type { Coordinates } from "@/domain/repositories/location.repository";
import type { HttpClient } from "@/infrastructure/http/HttpClient";

export type CreateListingInput = {
  categoryId: string;
  title: string;
  description: string;
  location: Coordinates;
  pricing:
    | {
        model: "fixed";
        price: {
          amountMinor: number;
          currency: string;
        };
      }
    | {
        model: "hourly";
        hourlyRate: {
          amountMinor: number;
          currency: string;
        };
        minimumHours: number;
      }
    | {
        model: "quote";
        startingFrom?: {
          amountMinor: number;
          currency: string;
        };
      };
};

export class ListingApi {
  constructor(private readonly httpClient: HttpClient) {}

  create(input: CreateListingInput): Promise<ListingDetail> {
    return this.httpClient.post<ListingDetail>("/v1/listings", input);
  }

  publish(id: string): Promise<ListingDetail> {
    return this.httpClient.post<ListingDetail>(
      `/v1/listings/${id}/publish`
    );
  }

  pause(id: string): Promise<ListingDetail> {
    return this.httpClient.post<ListingDetail>(
      `/v1/listings/${id}/pause`
    );
  }

  async mine(): Promise<ListingSummary[]> {
    const page = await this.httpClient.get<
      PaginatedResponse<ListingSummary>
    >("/v1/me/listings");

    return page.items;
  }
}