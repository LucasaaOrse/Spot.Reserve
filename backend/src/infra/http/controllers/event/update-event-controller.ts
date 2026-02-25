import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateEvent } from "../../../../main/factories/event/make-updateEvent";

export async function updateEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const bodySchema = z
    .object({
      title: z.string().min(5).optional(),
      description: z.string().nullable().optional(),
      date: z.coerce.date().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Informe ao menos um campo para atualização.",
    });

  const { id } = paramsSchema.parse(request.params);
  const { title, description, date } = bodySchema.parse(request.body);

    const useCase = makeUpdateEvent();

  const { event } = await useCase.execute({
    eventId: id,
    organizerId: (request.user as { sub: string }).sub,
    title,
    description,
    date,
  });


    return reply.status(200).send(event);
}
