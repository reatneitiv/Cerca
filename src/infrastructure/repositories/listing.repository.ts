import type { ListingDetail, ListingSummary } from "@/src/domain/entities/listing.entity";
import type { ListingRepository as ListingRepositoryContract, ListingSearchParams } from "@/src/domain/repositories/listing.repository";
import { ApiClient } from "@/src/infrastructure/api/api-client";
import type { ListingApiResponse, ListingListApiResponse } from "@/src/infrastructure/api/dtos/listing.dto";
import { ListingMapper } from "@/src/infrastructure/api/mappers/listing.mapper";
import { API_BASE_URL } from "@/src/infrastructure/config/api.config";

export class ApiListingRepository implements ListingRepositoryContract {
  private readonly apiClient = new ApiClient(API_BASE_URL);

  async findAll(params: ListingSearchParams): Promise<ListingSummary[]> {
    const raw = await this.apiClient.get<ListingListApiResponse>("/listings", {
      lat: params.lat,
      lng: params.lng,
      query: params.query,
      radiusKm: params.radiusKm,
      limit: params.limit,
    });
    return raw.items.map(ListingMapper.toSummary);
  }

  async findById(id: string): Promise<ListingDetail | null> {
    try {
      return ListingMapper.toDetail(await this.apiClient.get<ListingApiResponse>(`/listings/${id}`));
    } catch (error) {
      if (error instanceof Error && /404/.test(error.message)) return null;
      throw error;
    }
  }
}
