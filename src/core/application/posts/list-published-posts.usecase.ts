import { PostStatus } from "@/core/domain/post/post-status";
import {
  ListPostsFilter,
  PostListItem,
  PostRepository,
} from "@/core/domain/post/post.repository";

/** Listagem pública: apenas posts publicados. */
export class ListPublishedPostsUseCase {
  constructor(private readonly posts: PostRepository) {}

  execute(filter?: Omit<ListPostsFilter, "status">): Promise<PostListItem[]> {
    return this.posts.list({ ...filter, status: PostStatus.Published });
  }
}
