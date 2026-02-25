import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeListLocations } from "../../../../main/factories/location/make-getByIdLocation";




export async function getByIdLocationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getbyIdLocationBodySchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = getbyIdLocationBodySchema.parse(request.params);

    const getLocation = makeListLocations();
    

    const { location } = await getLocation.execute(id);

return reply.send({ location });
}