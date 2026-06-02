import { NotFoundError } from "@/core/domain/shared/errors";
import { PostStatus } from "@/core/domain/post/post-status";
import { PostRepository } from "@/core/domain/post/post.repository";
import { Post } from "@/core/domain/post/post.entity";
import { UpdatePostDTO } from "./post-dtos";
import { ensureUniqueSlug } from "./slug-uniqueness";

export class UpdatePostUseCase {
  constructor(private readonly posts: PostRepository) {}

  async execute(dto: UpdatePostDTO): Promise<{ id: string; slug: string }> {
    const post = await this.posts.findEntityById(dto.id);
    if (!post) throw new NotFoundError("Post", dto.id);

    let titleChanged = false;
    if (dto.title !== undefined) {
      titleChanged = dto.title.trim() !== post.title;
      post.changeTitle(dto.title, { regenerateSlug: titleChanged });
    }
    if (dto.excerpt !== undefined) post.changeExcerpt(dto.excerpt);
    if (dto.content !== undefined) post.changeContent(dto.content);
    if (dto.coverImage !== undefined) post.changeCover(dto.coverImage);
    if (dto.categoryId !== undefined) post.changeCategory(dto.categoryId);
    if (dto.type !== undefined) post.changeType(dto.type);

    if (dto.status !== undefined) {
      if (dto.status === PostStatus.Published) post.publish();
      else post.unpublish();
    }

    let finalPost = post;
    // Regenera o slug somente quando o título muda, preservando o id atual.
    if (titleChanged) {
      const base = post.slug;
      const unique = await ensureUniqueSlug(this.posts, base, post.id);
      finalPost = Post.restore({ ...post.toSnapshot(), slug: unique });
    }

    await this.posts.save(finalPost);
    return { id: finalPost.id, slug: finalPost.slug.value };
  }
}
