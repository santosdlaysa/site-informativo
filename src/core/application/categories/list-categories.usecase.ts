import {
  CategoryRepository,
  CategoryView,
} from "@/core/domain/category/category.repository";

export class ListCategoriesUseCase {
  constructor(private readonly categories: CategoryRepository) {}

  execute(): Promise<CategoryView[]> {
    return this.categories.list();
  }
}
