import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListLocations } from "../../../../main/factories/location/make-getAllLocation";
import type { Location } from "../../../../domain/entities/location";

export async function listLocationsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const listLocations = makeListLocations();

  const { locations }  = await listLocations.execute();

  return reply.send({
    locations: locations.map((l) => ({
      id: l.id,
      name: l.name,
      address: l.address,
    })),
  });
}