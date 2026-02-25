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

  const bodySchema = z
    .object({
      name: z.string().min(3).optional(),
      address: z.string().min(5).optional(),
      maxTables: z.number().int().positive().optional(),
      maxSeatsPerTable: z.number().int().positive().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Informe ao menos um campo para atualização.",
    });

  const { id } = paramsSchema.parse(request.params);
  const parsedPayload = bodySchema.parse(request.body);

    const payload = Object.fromEntries(
    Object.entries(parsedPayload).filter(([, value]) => value !== undefined)
  ) as Partial<{
    name: string;
    address: string;
    maxTables: number;
    maxSeatsPerTable: number;
  }>;

    const updateLocation = makeUpdateLocation();

  const { location } = await updateLocation.execute(id, payload);

  return reply.status(200).send({
    locationId: location.id,
  });
}