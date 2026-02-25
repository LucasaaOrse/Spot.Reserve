import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateLocation } from "../../../../main/factories/location/make-uptadeLocation";


export async function updateLocationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const bodySchema = z.object({
    name: z.string().min(3),
    address: z.string().min(5),
  });

  const { id } = paramsSchema.parse(request.params);
  const { name, address } = bodySchema.parse(request.body);

  try {
    const updateLocation = makeUpdateLocation();

    const { location } = await updateLocation.execute(id, {
      name,
      address,
    });

    return reply.status(200).send({
      locationId: location.id,
    });
  } catch {
    return reply.status(400).send({
      message: "Erro ao atualizar localidade.",
    });
  }
}