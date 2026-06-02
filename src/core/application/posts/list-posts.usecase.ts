import {
  ListPostsFilter,
  PostListItem,
  PostRepository,
} from "@/core/domain/post/post.repository";

/** Listagem administrativa: todos os posts (publicados e rascunhos). */
export class ListPostsUseCase {
  constructor(private readonly posts: PostRepository) {}

  execute(filter?: ListPostsFilter): Promise<PostListItem[]> {
    return this.posts.list(filter);
  }
}
