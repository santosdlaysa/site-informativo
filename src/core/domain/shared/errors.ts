/**
 * Erros de domínio. Não dependem de HTTP nem de framework — a camada de
 * apresentação decide como traduzi-los (status code, mensagem ao usuário).
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Violação de uma regra de negócio / invariante de entidade. */
export class ValidationError extends DomainError {}

/** Recurso esperado não encontrado. */
export class NotFoundError extends DomainError {
  constructor(resource: string, identifier?: string) {
    super(
      identifier
        ? `${resource} não encontrado: ${identifier}`
        : `${resource} não encontrado`,
    );
  }
}

/** Conflito com o estado atual (ex.: slug já em uso). */
export class ConflictError extends DomainError {}
