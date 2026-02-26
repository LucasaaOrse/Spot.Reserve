import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetEventLayoutUseCase } from "../../../../main/factories/event/make-getEventLayout";

export async function getEventLayoutController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    eventId: z.string().uuid(),
  });

  const { eventId } = paramsSchema.parse(request.params);

  // currentUserId pode ser null se não estiver autenticado (rota pública)
  const currentUserId = (request.user as { sub?: string } | undefined)?.sub ?? undefined;

  const useCase = makeGetEventLayoutUseCase();
  const result = await useCase.execute({ eventId, currentUserId });

  return reply.status(200).send(result);
}
