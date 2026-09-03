"use client";

import { useCallback, useEffect, useState } from "react";
import type { GalleryItemView } from "@/core/domain/project/project.repository";
import { CompanyLink as Link } from "./company-link";

/**
 * Galeria de fotos do post. Itens com `linkedPostSlug` continuam navegando
 * para o post vinculado (modo "Projetos"); fotos simples abrem um lightbox
 * em carrossel (setas, teclado e clique no fundo para fechar).
 */
export function PostGallery({ items }: { items: GalleryItemView[] }) {
  const photos = items.filter((it) => it.image && !it.linkedPostSlug);
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  const current = index !== null ? photos[index] : null;

  return (
    <>
      <div className="gallery-grid">
        {items.map((it) => {
          const inner = (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="gimg" src={it.image ?? ""} alt={it.caption ?? ""} loading="lazy" />
              {it.caption && (
                <div className="cap">
                  <h3>{it.caption}</h3>
                </div>
              )}
            </>
          );

          if (it.linkedPostSlug) {
            return (
              <Link className="proj-card" href={`/posts/${it.linkedPostSlug}`} key={it.id}>
                {inner}
              </Link>
            );
          }

          const photoIndex = photos.findIndex((p) => p.id === it.id);
          return (
            <button
              type="button"
              className="proj-card proj-card--zoom"
              key={it.id}
              onClick={() => setIndex(photoIndex)}
              aria-label="Ampliar foto"
            >
              {inner}
              <span className="zoom-badge" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
                </svg>
              </span>
            </button>
          );
        })}
      </div>

      {open && current && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={close}>
          <button className="lb-close" onClick={close} aria-label="Fechar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {photos.length > 1 && (
            <button
              className="lb-nav lb-prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Foto anterior"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}

          <figure className="lb-stage" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image ?? ""} alt={current.caption ?? ""} />
            <figcaption>
              {current.caption && <span>{current.caption}</span>}
              {photos.length > 1 && (
                <span className="lb-counter">
                  {index! + 1} / {photos.length}
                </span>
              )}
            </figcaption>
          </figure>

          {photos.length > 1 && (
            <button
              className="lb-nav lb-next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Próxima foto"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
