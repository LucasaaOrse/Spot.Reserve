import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../../application/errors/app-error";


export function verifyUserRole(roleToVerify: 'ADMIN' | 'ORGANIZER' | 'GUEST') {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    // Garantimos que o usuário existe antes de acessar a role
    const user = request.user as { role: string } | undefined;

    if (!user || user.role !== roleToVerify) {
      throw new AppError("Acesso negado: Permissão insuficiente.", 403);
    }
  };
}