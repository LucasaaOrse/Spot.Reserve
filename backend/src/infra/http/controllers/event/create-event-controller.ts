import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateEventUseCase } from "../../../../main/factories/event/make-createEvent";

export async function createEventController(request: FastifyRequest, reply: FastifyReply) {
const bodySchema = z.object({
    title: z.string().min(5),
    description: z.string().nullable().optional(),
    date: z.coerce.date(),
    locationId: z.string().uuid(),
  });

  const organizerId = (request.user as { sub: string }).sub;
  const { title, description, date, locationId } = bodySchema.parse(request.body);
    const createEvent = makeCreateEventUseCase(); 

    // 3. Executar o Use Case passando os dados corretos
    const { event } = await createEvent.execute({
    title,
    description: description ?? null,
    date,
    organizerId,
    locationId,
  });

      return reply.status(201).send({ eventId: event.id });
}