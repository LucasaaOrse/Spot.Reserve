import type { FastifyReply, FastifyRequest } from "fastify";
import { PrismaEventRepository } from "../../../database/prisma-event-repository";
import { GetEventByIdUseCase } from "../../../../application/use-cases/event/getById-event";
import { makeGetEventByIdUseCase } from "../../../../main/factories/event/make-getByIdEvent";

export async function getEventByIdController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };

  const useCase = makeGetEventByIdUseCase();
  

  const { event } = await useCase.execute({ eventId: id });

  return reply.status(200).send(event);
}