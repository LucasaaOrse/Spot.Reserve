import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetAllSpace } from "../../../../main/factories/space/make-getAllSpace";

export async function getAllSpaceController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getAllSpace = makeGetAllSpace();
    const spaces = await getAllSpace.execute();

    return reply.send({ spaces });
  } catch (err) {
    return reply.status(400).send({
      message: "Spaces not found",
    });
  }
}