import { Post } from "@/core/domain/post/post.entity";
import { PostRepository } from "@/core/domain/post/post.repository";
import { IdGenerator } from "../ports/id-generator";
import { CreatePostDTO } from "./post-dtos";
import { ensureUniqueSlug } from "./slug-uniqueness";

export class CreatePostUseCase {
  constructor(
    private readonly posts: PostRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(dto: CreatePostDTO): Promise<{ id: string; slug: string }> {
    const post = Post.create({
      id: this.ids.generate(),
      title: dto.title,
      excerpt: dto.excerpt ?? null,
      content: dto.content ?? "",
      coverImage: dto.coverImage ?? null,
      categoryId: dto.categoryId ?? null,
      type: dto.type,
      status: dto.status,
      authorId: dto.authorId,
    });

    // Resolve colisões de slug antes de persistir.
    const unique = await ensureUniqueSlug(this.posts, post.slug);
    const snapshot = post.toSnapshot();
    const finalPost = Post.restore({ ...snapshot, slug: unique });

    await this.posts.save(finalPost);
    return { id: finalPost.id, slug: finalPost.slug.value };
  }
}
