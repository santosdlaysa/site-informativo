import { PostStatus, PostType } from "@/core/domain/post/post-status";

export interface CreatePostDTO {
  title: string;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  categoryId?: string | null;
  type?: PostType;
  status?: PostStatus;
  authorId: string;
}

export interface UpdatePostDTO {
  id: string;
  title?: string;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  categoryId?: string | null;
  type?: PostType;
  status?: PostStatus;
}
