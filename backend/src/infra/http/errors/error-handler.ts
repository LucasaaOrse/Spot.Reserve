import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../../../application/errors/app-error";

function inferStatusCodeFromMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid credentials")) return 401;
  if (normalized.includes("não autorizado")) return 401;
  if (normalized.includes("acesso negado")) return 403;
  if (normalized.includes("não encontrado") || normalized.includes("not found")) return 404;

  return 400;
}

export function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Dados inválidos.",
        issues: error.issues,
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message,
        details: error.details,
      });
    }

    if (error instanceof Error) {
      const statusCode = inferStatusCodeFromMessage(error.message);

      if (statusCode < 500) {
        return reply.status(statusCode).send({ message: error.message });
      }
    }

    app.log.error(error);

    return reply.status(500).send({
      message: "Erro interno do servidor.",
    });
  });
}

