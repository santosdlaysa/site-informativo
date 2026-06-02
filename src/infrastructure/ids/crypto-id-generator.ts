import { randomUUID } from "node:crypto";
import { IdGenerator } from "@/core/application/ports/id-generator";

/** Implementação de IdGenerator baseada em UUID v4 do runtime. */
export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
