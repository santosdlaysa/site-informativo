import Link from "next/link";
import { PostListItem } from "@/core/domain/post/post.repository";
import { ImageSlot } from "../image-slot";
import { badgeClass } from "@/presentation/lib/category-variant";
import { formatLongDate } from "@/presentation/lib/format";

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <Link className="card" href={`/posts/${post.slug}`}>
      <div className="thumb">
        <ImageSlot src={post.coverImage} placeholder="" rounded={false} />
        {post.category && (
          <span className={badgeClass(post.category.variant, { onImg: true })}>
            {post.category.name}
          </span>
        )}
      </div>
      <div className="body">
        <h3>{post.title}</h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        <span className="date">{formatLongDate(post.publishedAt ?? post.createdAt)}</span>
      </div>
    </Link>
  );
}
