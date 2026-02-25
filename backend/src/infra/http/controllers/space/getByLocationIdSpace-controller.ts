import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetByLocationIdSpace } from "../../../../main/factories/space/make-getByLocationIdSpace";

export async function getByLocationIdSpaceController(request: FastifyRequest, reply: FastifyReply) {
  const getByLocationIdSpaceBodySchema = z.object({
    locationId: z.string().uuid(),
  });

  const { locationId } = getByLocationIdSpaceBodySchema.parse(request.params);

  try {
    const getByLocationIdSpace = makeGetByLocationIdSpace();

    const { spaces } = await getByLocationIdSpace.execute({ locationId });

    return reply.send({ spaces });
  } catch (err) {
    return reply.status(400).send({
      message: "Space not found",
    });
  }
}