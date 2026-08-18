import type { Category } from "@/domain/entities/category.entity";

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
}
