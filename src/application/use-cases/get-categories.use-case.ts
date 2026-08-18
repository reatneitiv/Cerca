import type { CategoryRepository } from "@/domain/repositories/category.repository";

export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  execute() {
    return this.categoryRepository.findAll();
  }
}
