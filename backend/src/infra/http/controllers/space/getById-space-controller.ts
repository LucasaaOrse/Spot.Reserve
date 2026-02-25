import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetSpaceByIdUseCase } from "../../../../main/factories/space/make-findbyIdSpace";

export async function getByIdSpaceController(request: FastifyRequest, reply: FastifyReply) {
  const GetbyIdSpaceBodySchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = GetbyIdSpaceBodySchema.parse(request.params);

  try {
    const getSpace = makeGetSpaceByIdUseCase();

    const { space } = await getSpace.execute({ id }); 

    return reply.send({ space });
  } catch (err) {
    return reply.status(400).send({
      message: "Space not found",
    });
  }
}