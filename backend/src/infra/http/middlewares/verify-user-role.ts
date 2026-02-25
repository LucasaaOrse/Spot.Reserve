import type { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserRole(roleToVerify: 'ADMIN' | 'ORGANIZER' | 'GUEST') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Garantimos que o usuário existe antes de acessar a role
    const user = request.user as { role: string } | undefined;

    if (!user || user.role !== roleToVerify) {
      return reply.status(403).send({ message: "Acesso negado: Permissão insuficiente." });
    }
  };
}