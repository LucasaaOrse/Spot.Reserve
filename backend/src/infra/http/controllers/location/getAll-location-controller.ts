import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListLocations } from "../../../../main/factories/location/make-getAllLocation";

export async function listLocationsController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const listLocations = makeListLocations();

  const { locations } = await listLocations.execute();

  return reply.send({
    locations: locations.map((location) => ({
      id: location.id,
      name: location.name,
      address: location.address,
      maxTables: location.maxTables,
      maxSeatsPerTable: location.maxSeatsPerTable,
    })),
  });
}