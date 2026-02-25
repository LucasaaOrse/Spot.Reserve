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
  });

  const { name, address } = createLocationBodySchema.parse(request.body);

  try {
    const createLocation = makeCreateLocation();

    const { location } = await createLocation.execute({
      name,
      address,
      maxSeatsPerTable: 1,
      maxTables: 1
    });

    return reply.status(201).send({ locationId: location.id });
  } catch (err) {
    return reply.status(400).send({
      message: "Erro ao criar localidade.",
    });
  }
}