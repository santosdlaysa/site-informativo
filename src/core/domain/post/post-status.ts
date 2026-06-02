export enum PostStatus {
  Draft = "DRAFT",
  Published = "PUBLISHED",
}

export enum PostType {
  /** Post comum: título, resumo, conteúdo, capa. */
  Standard = "STANDARD",
  /** Galeria de projetos: grade de imagens que abrem outros posts existentes. */
  Projects = "PROJECTS",
}
