export interface CategoryView {
  id: string;
  name: string;
  slug: string;
  variant: string;
  postCount: number;
}

/** Porta do repositório de categorias. */
export interface CategoryRepository {
  list(): Promise<CategoryView[]>;
  findById(id: string): Promise<CategoryView | null>;
  findBySlug(slug: string): Promise<CategoryView | null>;
}
