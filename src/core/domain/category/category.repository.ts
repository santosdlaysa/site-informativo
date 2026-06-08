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
  /**
   * Cria uma categoria a partir do nome. Idempotente: se já existir uma
   * categoria com o mesmo nome/slug, retorna a existente em vez de duplicar.
   */
  create(name: string): Promise<CategoryView>;
}
