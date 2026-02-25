import type { FastifyReply, FastifyRequest } from "fastify";
import { makeGetEventByIdUseCase } from "../../../../main/factories/event/make-getByIdEvent";

export async function getEventByIdController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const organizerId = (request.user as any).sub;

  const useCase = makeGetEventByIdUseCase();
  const { event } = await useCase.execute({ eventId: id });

  if (!event || event.organizerId !== organizerId) {
    return reply.status(403).send({ message: "Você não tem permissão para acessar este evento." });
  }

  return reply.status(200).send(event);
}
