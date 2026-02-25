import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateLocation } from "../../../../main/factories/location/make-createlocation";


export async function createLocationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createLocationBodySchema = z.object({
    name: z.string().min(3),
    address: z.string().min(5),
    maxTables: z.number().int().positive(),
    maxSeatsPerTable: z.number().int().positive(),
  });

  const { name, address, maxTables, maxSeatsPerTable } =
    createLocationBodySchema.parse(request.body);

    const createLocation = makeCreateLocation();

    const { location } = await createLocation.execute({
    name,
    address,
    maxTables,
    maxSeatsPerTable,
  });

    return reply.status(201).send({ locationId: location.id });
}