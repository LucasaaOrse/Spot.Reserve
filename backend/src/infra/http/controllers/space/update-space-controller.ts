import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateSpace } from "../../../../main/factories/space/make-uptadeSpace";

export async function updateSpaceController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z.object({
  name: z.string().min(3).optional(),
  locationId: z.string().uuid().optional(),
  totalArea: z.number().positive().optional(),
});

const { id } = paramsSchema.parse(request.params);
const { name, locationId, totalArea } = bodySchema.parse(request.body);

  try {
    const updateSpace = makeUpdateSpace();

    const { space } = await updateSpace.execute({
  id,
  ...(name !== undefined && { name }),
  ...(locationId !== undefined && { locationId }),
  ...(totalArea !== undefined && { totalArea }),
});

    return reply.status(200).send({ spaceId: space.id });
  } catch (err) {
    return reply.status(400).send({
      message: "Space not found",
    });
  }
}