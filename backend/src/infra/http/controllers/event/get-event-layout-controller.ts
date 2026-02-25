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

  try {
    const useCase = makeGetEventLayoutUseCase();
    const result = await useCase.execute(eventId);

    return reply.status(200).send(result);
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(404).send({ message: err.message });
    }

    return reply
      .status(500)
      .send({ message: "Erro interno ao buscar layout do evento." });
  }
}
