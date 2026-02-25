import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListEvent } from "../../../../main/factories/event/make-listEvent";

export async function listEventsByOrganizerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { organizerId } = request.query as { organizerId: string };

  const useCase = makeListEvent()

  const { events } = await useCase.execute({ organizerId });

  return reply.status(200).send(events);
}