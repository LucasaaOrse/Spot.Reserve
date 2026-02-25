import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeListLocations } from "../../../../main/factories/location/make-getByIdLocation";




export async function getByIdLocationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const GetbyIdLocationBodySchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = GetbyIdLocationBodySchema.parse(request.params);

  try {
    const getLocation = makeListLocations();
    

    const { location } = await getLocation.execute(id);

    return reply.send({ location });
}

catch (err) {
  return reply.status(400).send({
    message: "Location not found",
  });
}
}