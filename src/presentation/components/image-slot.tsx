"use client";

import { useCallback, useRef, useState } from "react";

interface ImageSlotProps {
  /** URL/data-URL inicial da imagem (vinda do banco). */
  src?: string | null;
  placeholder?: string;
  /** Quando true, permite clicar/arrastar para enviar uma imagem. */
  editable?: boolean;
  /** Recebe o data-URL (já redimensionado) quando o usuário envia uma imagem. */
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
 * aceita upload por clique ou drag-and-drop.
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
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          hidden
          onChange={(e) => void ingest(e.target.files?.[0] ?? undefined)}
        />
      )}
    </div>
  );
}
