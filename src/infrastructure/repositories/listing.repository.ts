import type { ListingDetail } from "@/domain/entities/listing.entity";
import type { ListingPage, ListingRepository as ListingRepositoryContract, ListingSearchParams } from "@/domain/repositories/listing.repository";
import { ApiClient } from "@/infrastructure/api/api-client";
import type { ListingApiResponse, ListingListApiResponse } from "@/infrastructure/api/dtos/listing.dto";
import { ListingMapper } from "@/infrastructure/api/mappers/listing.mapper";
import { API_BASE_URL } from "@/infrastructure/config/api.config";

export class ApiListingRepository implements ListingRepositoryContract {
  private readonly apiClient = new ApiClient(API_BASE_URL);

  async findAll(params: ListingSearchParams): Promise<ListingPage> {
    const raw = await this.apiClient.get<ListingListApiResponse>("/listings", {
      lat: params.lat,
      lng: params.lng,
      query: params.query,
      radiusKm: params.radiusKm,
      limit: params.limit,
      cursor: params.cursor,
      categoryId: params.categoryId,
    });
    return {
      items: raw.items.map(ListingMapper.toSummary),
      nextCursor: raw.nextCursor,
    };
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
