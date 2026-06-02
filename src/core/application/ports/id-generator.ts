/** Porta para geração de identificadores únicos (implementada na infraestrutura). */
export interface IdGenerator {
  generate(): string;
}
