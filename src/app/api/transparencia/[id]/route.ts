import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const document = await prisma.transparencyDocument.findFirst({
    where: { id, published: true, company: { slug: "adsocial" } },
    select: { fileData: true, fileName: true, mimeType: true },
  });
  if (!document) return new NextResponse("Documento não encontrado.", { status: 404 });

  const safeName = document.fileName.replace(/[\r\n"\\]/g, "_");
  return new NextResponse(document.fileData, {
    headers: {
      "Content-Type": document.mimeType,
      "Content-Disposition": `inline; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`,
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
