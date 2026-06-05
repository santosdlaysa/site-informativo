/**
 * Galeria opcional de um post: itens (imagem + legenda) que podem apontar para
 * outros posts existentes ou abrir a imagem ampliada. O "dono" da galeria é o
 * próprio post; este repositório cuida apenas dos itens.
 */
export interface GalleryItemInput {
  image: string | null;
  caption: string | null;
  linkedPostId: string | null;
  position: number;
}

export interface GalleryItemView {
  id: string;
  image: string | null;
  caption: string | null;
  linkedPostId: string | null;
  linkedPostSlug: string | null;
  linkedPostTitle: string | null;
}

export interface ProjectRepository {
  /** Substitui toda a galeria do post pelos itens informados (transacional). */
  replaceGallery(ownerPostId: string, items: GalleryItemInput[]): Promise<void>;
  /** Itens da galeria com dados do post vinculado, ordenados por posição. */
  getGallery(ownerPostId: string): Promise<GalleryItemView[]>;
}
