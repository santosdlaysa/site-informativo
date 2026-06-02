/**
 * Galeria de um post do tipo PROJECTS: itens (imagem + legenda) que apontam
 * para outros posts existentes. O "dono" da galeria é um Post (type=PROJECTS);
 * este repositório cuida apenas dos itens.
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
