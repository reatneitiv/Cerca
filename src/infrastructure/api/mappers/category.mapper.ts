import type { Category } from "@/domain/entities/category.entity";
import type { CategoryApiResponse } from "@/infrastructure/api/dtos/category.dto";

export class CategoryMapper {
  static toDomain(category: CategoryApiResponse): Category {
    return { id: category.id, name: category.name };
  }
}
