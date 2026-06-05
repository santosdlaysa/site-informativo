// Redimensiona as fotos pesadas das ações (10–14 MB) para versões web
// (~1400px, JPEG q80) e grava em public/acoes/<slug>/. Gera também um
// manifest.json com a lista ordenada de imagens por ação (cover = 1ª).
import sharp from "sharp";
import { readdir, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src", "assets");
const OUT = path.join(ROOT, "public", "acoes");

const ACTIONS = [
  { slug: "juventude-atualizada", dir: "Projeto juventude atualizada -  centro social" },
  { slug: "mutirao-doencas-raras", dir: "Mutirão de atendimentos de pacientes com doenças genéticas" },
  { slug: "forum-doencas-geneticas", dir: "1 fórum de Roraima em doenças raras e neurodivergentes" },
];

const IMG_RE = /\.(jpe?g|png|webp|avif)$/i;
// Fotos profissionais (prefixo MAG) primeiro — viram capa e abrem a galeria.
const rank = (name) => (/^MAG/i.test(name) ? 0 : 1);

await mkdir(OUT, { recursive: true });

const manifest = {};

for (const action of ACTIONS) {
  const srcDir = path.join(SRC, action.dir);
  if (!existsSync(srcDir)) {
    console.warn(`! pasta não encontrada: ${action.dir}`);
    continue;
  }
  const outDir = path.join(OUT, action.slug);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(srcDir))
    .filter((f) => IMG_RE.test(f))
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, "pt"));

  const out = [];
  let i = 0;
  for (const file of files) {
    i += 1;
    const name = String(i).padStart(2, "0") + ".jpg";
    await sharp(path.join(srcDir, file))
      .rotate() // respeita orientação EXIF
      .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(outDir, name));
    out.push(`/acoes/${action.slug}/${name}`);
    process.stdout.write(`\r${action.slug}: ${i}/${files.length}   `);
  }
  manifest[action.slug] = out;
  console.log(`\n✓ ${action.slug}: ${out.length} imagens`);
}

await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("Manifest gravado em public/acoes/manifest.json");
