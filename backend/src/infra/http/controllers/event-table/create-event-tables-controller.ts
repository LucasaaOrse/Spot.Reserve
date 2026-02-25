import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateEventTables } from "../../../../main/factories/event-table/make-create-event-tables";

export async function createEventTablesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    eventId: z.string().uuid(),
  });

  const bodySchema = z.object({
    tables: z.array(
      z.object({
        name: z.string().min(1),
        coord_x: z.number(),
        coord_y: z.number(),
      })
    ).min(1),
  });

  const { eventId } = paramsSchema.parse(request.params);
  const { tables } = bodySchema.parse(request.body);


    const useCase = makeCreateEventTables();
    const result = await useCase.execute({ eventId, tables });

    return reply.status(201).send(result);
}