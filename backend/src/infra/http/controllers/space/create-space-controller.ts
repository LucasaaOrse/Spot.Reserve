import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateSpace } from "../../../../main/factories/space/make-createSpace";

export async function createSpaceController(request: FastifyRequest, reply: FastifyReply) {
  const createSpaceBodySchema = z.object({
    name: z.string().min(3),
    locationId: z.string().uuid(),
    totalArea: z.number().positive().optional(),
  });

  const { name, locationId, totalArea } = createSpaceBodySchema.parse(request.body);

  try {
    const createSpace = makeCreateSpace();

    const { space } = await createSpace.execute({ name, locationId, totalArea: totalArea ?? null });

    return reply.status(201).send({ spaceId: space.id });
  } catch (err) {
  if (err instanceof Error) {
    return reply.status(400).send({ message: err.message });
  }

  return reply.status(500).send({
    message: "Internal server error",
  });
}
}