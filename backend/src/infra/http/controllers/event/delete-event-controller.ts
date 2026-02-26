import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeDeleteEventUseCase } from "../../../../main/factories/event/make-deleteEvent";

export async function deleteEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = paramsSchema.parse(request.params);
  const organizerId = (request.user as { sub: string }).sub;

  const useCase = makeDeleteEventUseCase();

  await useCase.execute({ eventId: id, organizerId });

  return reply.status(204).send();
}
