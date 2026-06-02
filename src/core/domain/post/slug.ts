import { ValidationError } from "../shared/errors";

/**
 * Value object: identificador amigável de URL.
 * Imutável e sempre válido após a construção.
 */
export class Slug {
  private constructor(public readonly value: string) {}

  /** Gera um slug a partir de um texto livre (ex.: título do post). */
  static fromText(text: string): Slug {
    const normalized = text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // remove acentos combinantes
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!normalized) {
      throw new ValidationError("Não foi possível gerar um slug a partir do texto informado.");
    }
    return new Slug(normalized);
  }

  /** Reidrata um slug já persistido (assume-se válido). */
  static restore(value: string): Slug {
    if (!value) throw new ValidationError("Slug vazio.");
    return new Slug(value);
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
