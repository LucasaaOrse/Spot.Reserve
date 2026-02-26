import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../../../application/errors/app-error";

export function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) => {
    // Zod validation error
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Dados inválidos.",
        issues: error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }

    // AppError (domínio/aplicação)
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      });
    }

    if (error instanceof Error) {
      const message = error.message;
      const lower = message.toLowerCase();

      // Erros do Prisma — mapeia código para mensagem legível
      // @ts-ignore
      const prismaCode: string | undefined = error?.code;
      if (prismaCode) {
        if (prismaCode === "P2003") {
          // Foreign key constraint fail
          return reply.status(400).send({
            message: "Referência inválida: verifique se o espaço selecionado existe.",
          });
        }
        if (prismaCode === "P2002") {
          // Unique constraint fail
          return reply.status(409).send({
            message: "Este registro já existe.",
          });
        }
        if (prismaCode === "P2025") {
          // Record not found
          return reply.status(404).send({
            message: "Registro não encontrado.",
          });
        }
      }

      // Erros de autenticação
      if (lower.includes("invalid credentials") || lower.includes("não autorizado")) {
        return reply.status(401).send({ message });
      }
      if (lower.includes("acesso negado") || lower.includes("permissão")) {
        return reply.status(403).send({ message });
      }
      if (lower.includes("não encontrado") || lower.includes("not found")) {
        return reply.status(404).send({ message });
      }
      if (lower.includes("já existe") || lower.includes("already exists")) {
        return reply.status(409).send({ message });
      }

      // Erros de validação de entidade (domínio)
      const businessTerms = [
        "título", "data", "nome", "capacidade", "convite",
        "assento", "mesa", "e-mail", "senha", "caracteres",
        "futuro", "passada", "permitir", "curto",
      ];
      if (businessTerms.some((term) => lower.includes(term))) {
        return reply.status(400).send({ message });
      }
    }

    // Erro inesperado — loga o erro completo no servidor
    app.log.error(error);

    return reply.status(500).send({
      message: "Erro interno do servidor.",
    });
  });
}
