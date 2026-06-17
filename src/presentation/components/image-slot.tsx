"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ImageSlotProps {
  /** URL/data-URL inicial da imagem (vinda do banco). */
  src?: string | null;
  placeholder?: string;
  /** Quando true, permite clicar/arrastar para enviar uma imagem. */
  editable?: boolean;
  /** Recebe o data-URL redimensionado, ou string vazia quando a imagem é removida. */
  onChange?: (dataUrl: string) => void;
  className?: string;
  rounded?: boolean;
}

const MAX_DIM = 1200;
const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/avif"];

async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  return canvas.toDataURL("image/webp", 0.85);
}

/**
 * Substituto React do custom element <image-slot> dos protótipos.
 * Lê de `src` (read-only nas páginas públicas) e, quando `editable`,
 * aceita upload por clique ou drag-and-drop, convertendo a imagem para
 * data-URL (armazenada no banco junto do registro).
 */
export function ImageSlot({
  src,
  placeholder = "Imagem",
  editable = false,
  onChange,
  className,
  rounded = true,
}: ImageSlotProps) {
  const [preview, setPreview] = useState<string | null>(src ?? null);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(src ?? null);
  }, [src]);

  const ingest = useCallback(
    async (file: File | undefined) => {
      if (!file || !ACCEPT.includes(file.type)) return;
      const url = await fileToDataUrl(file);
      setPreview(url);
      onChange?.(url);
    },
    [onChange],
  );

  const style: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: preview ? "transparent" : "rgba(15,23,42,.06)",
    color: "rgba(0,0,0,.5)",
    fontSize: 13,
    cursor: editable ? "pointer" : "default",
    outline: over ? "2px solid #2563eb" : "none",
    outlineOffset: -2,
    borderRadius: rounded ? "inherit" : 0,
    overflow: "hidden",
  };

  return (
    <div
      className={className}
      style={style}
      onClick={() => editable && inputRef.current?.click()}
      onDragOver={(e) => {
        if (!editable) return;
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        if (!editable) return;
        e.preventDefault();
        setOver(false);
        void ingest(e.dataTransfer.files?.[0]);
      }}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <span style={{ padding: 8, textAlign: "center", fontWeight: 500 }}>{placeholder}</span>
      )}
      {editable && (
        <>
          {preview && (
            <button
              type="button"
              title="Remover imagem"
              aria-label="Remover imagem"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                if (inputRef.current) inputRef.current.value = "";
                onChange?.("");
              }}
              style={{
                position: "absolute",
                right: 10,
                top: 10,
                width: 34,
                height: 34,
                border: "1px solid rgba(255,255,255,.7)",
                borderRadius: 8,
                background: "rgba(15,23,42,.72)",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
              </svg>
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT.join(",")}
            hidden
            onChange={(e) => void ingest(e.target.files?.[0] ?? undefined)}
          />
        </>
      )}
    </div>
  );
}
