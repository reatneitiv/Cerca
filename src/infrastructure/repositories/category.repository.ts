import type { Category } from "@/domain/entities/category.entity";
import type { CategoryRepository as CategoryRepositoryContract } from "@/domain/repositories/category.repository";
import { ApiClient } from "@/infrastructure/api/api-client";
import type { CategoryApiResponse } from "@/infrastructure/api/dtos/category.dto";
import { CategoryMapper } from "@/infrastructure/api/mappers/category.mapper";
import { API_BASE_URL } from "@/infrastructure/config/api.config";

export class ApiCategoryRepository implements CategoryRepositoryContract {
  private readonly apiClient = new ApiClient(API_BASE_URL);

  async findAll(): Promise<Category[]> {
    const raw = await this.apiClient.get<CategoryApiResponse[]>("/categories");
    return raw.map(CategoryMapper.toDomain);
  }
}
