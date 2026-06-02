import { NotFoundError } from "@/core/domain/shared/errors";
import { PostDetail, PostRepository } from "@/core/domain/post/post.repository";

export class GetPostBySlugUseCase {
  constructor(private readonly posts: PostRepository) {}

  async execute(slug: string): Promise<PostDetail> {
    const post = await this.posts.findDetailBySlug(slug);
    if (!post) throw new NotFoundError("Post", slug);
    return post;
  }
}
