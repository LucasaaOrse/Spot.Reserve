import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCancelReservationUseCase } from "../../../../main/factories/reservation/make-cancel-reservation";

export async function cancelReservationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    eventId: z.string().uuid(),
  });

  const { eventId } = paramsSchema.parse(request.params);
  const userId = (request.user as { sub: string }).sub;

  const useCase = makeCancelReservationUseCase();

  await useCase.execute({ eventId, userId });

  return reply.status(204).send();
}
