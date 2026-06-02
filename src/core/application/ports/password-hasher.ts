/** Porta para hashing/verificação de senhas (implementada na infraestrutura). */
export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
