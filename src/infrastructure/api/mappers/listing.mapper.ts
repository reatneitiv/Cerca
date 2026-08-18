import type { ListingDetail, ListingSummary } from "@/domain/entities/listing.entity";
import type { ListingApiResponse, ListingSearchItemApiResponse, MoneyApiResponse } from "@/infrastructure/api/dtos/listing.dto";

function toMoney(money: MoneyApiResponse | null) {
  return money ? { amountMinor: money.amountMinor, currency: money.currency } : null;
}

export class ListingMapper {
  static toSummary(item: ListingSearchItemApiResponse): ListingSummary {
    return {
      id: item.id,
      title: item.title,
      categoryId: item.categoryId,
      priceFrom: toMoney(item.priceFrom),
      status: item.status,
      ratingAvg: item.ratingAvg,
      ratingCount: item.ratingCount,
      distanceMeters: item.distanceMeters
    };
  }

  static toDetail(item: ListingApiResponse): ListingDetail {
    return {
      id: item.id,
      ownerId: item.ownerId,
      categoryId: item.categoryId,
      title: item.title,
      description: item.description,
      pricing: item.pricing,
      priceFrom: toMoney(item.priceFrom),
      status: item.status,
      ratingAvg: item.ratingAvg,
      ratingCount: item.ratingCount,
      createdAt: item.createdAt
    };
  }
}
