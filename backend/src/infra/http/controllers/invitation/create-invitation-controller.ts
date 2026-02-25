import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateInvitationUseCase } from "../../../../main/factories/invitation/make-create-invitation";

export async function createInvitationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    eventId: z.string().uuid(),
  });

  const bodySchema = z.object({
    emails: z.array(z.string().email()).min(1),
  });

  const { eventId } = paramsSchema.parse(request.params);
  const { emails } = bodySchema.parse(request.body);

  const organizerId = (request.user as { sub: string }).sub;

  try {
    const useCase = makeCreateInvitationUseCase();

    const result = await useCase.execute({
      eventId,
      organizerId,
      emails,
    });

    return reply.status(201).send(result);
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(400).send({ message: err.message });
    }

    return reply
      .status(500)
      .send({ message: "Erro interno ao criar convites." });
  }
}
