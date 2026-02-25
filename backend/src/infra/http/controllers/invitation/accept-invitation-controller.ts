import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeAcceptInvitationUseCase } from "../../../../main/factories/invitation/make-accept-invitation";
import { PrismaUserRepository } from "../../../database/prisma-user-repository";

export async function acceptInvitationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z.object({
    token: z.string().min(10),
  });

  const { token } = bodySchema.parse(request.body);

  const userId = (request.user as { sub: string }).sub;

  try {
    const userRepository = new PrismaUserRepository();
    const user = await userRepository.findById(userId);

    if (!user) {
      return reply.status(404).send({ message: "Usuário não encontrado." });
    }

    const useCase = makeAcceptInvitationUseCase();

    const { invitation } = await useCase.execute({
      token,
      userId,
      userEmail: user.email,
    });

    return reply.status(200).send({
      invitationId: invitation.id,
      eventId: invitation.eventId,
      status: invitation.status,
    });
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(400).send({ message: err.message });
    }

    return reply
      .status(500)
      .send({ message: "Erro interno ao aceitar convite." });
  }
}
