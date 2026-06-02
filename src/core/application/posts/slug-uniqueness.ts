import { Slug } from "@/core/domain/post/slug";
import { PostRepository } from "@/core/domain/post/post.repository";

/**
 * Garante um slug único derivado do título, anexando sufixos (-2, -3, ...)
 * caso já exista. `ignoreId` permite que um post mantenha o próprio slug ao editar.
 */
export async function ensureUniqueSlug(
  repo: PostRepository,
  base: Slug,
  ignoreId?: string,
): Promise<Slug> {
  let candidate = base.value;
  let suffix = 2;
  while (await repo.slugExists(candidate, ignoreId)) {
    candidate = `${base.value}-${suffix}`;
    suffix += 1;
  }
  return Slug.restore(candidate);
}
