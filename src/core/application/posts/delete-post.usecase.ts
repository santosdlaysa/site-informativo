import { NotFoundError } from "@/core/domain/shared/errors";
import { PostRepository } from "@/core/domain/post/post.repository";

export class DeletePostUseCase {
  constructor(private readonly posts: PostRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.posts.findEntityById(id);
    if (!existing) throw new NotFoundError("Post", id);
    await this.posts.delete(id);
  }
}
