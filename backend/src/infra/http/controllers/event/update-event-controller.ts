import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateEvent } from "../../../../main/factories/event/make-updateEvent";
import { PrismaEventRepository } from "../../../database/prisma-event-repository";

export async function updateEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const bodySchema = z.object({
    title: z.string().min(5).optional(),
    description: z.string().nullable().optional(),
    date: z.coerce.date().optional(),
  });

  const { id } = paramsSchema.parse(request.params);
  const { title, description, date } = bodySchema.parse(request.body);

    const useCase = makeUpdateEvent();

    const organizerId = (request.user as any).sub;
    const eventRepository = new PrismaEventRepository();

    const event = await eventRepository.findById(id);


    if (!event || event.organizerId !== organizerId) {
      return reply.status(400).send({ message: "Evento não encontrado ou não pertence ao organizador." });
    }

      return reply.status(200).send(event);
}
