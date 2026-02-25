import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateEvent } from "../../../../main/factories/event/make-updateEvent";

export async function updateEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // 1. Validar o ID nos parâmetros
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  // 2. Validar o corpo da requisição
  const bodySchema = z.object({
    title: z.string().min(5).optional(),
    description: z.string().nullable().optional(),
    date: z.coerce.date().optional(), // Coerce já transforma string em Date se existir
  });

  const { id } = paramsSchema.parse(request.params);
  const { title, description, date } = bodySchema.parse(request.body);

  try {
   const useCase = makeUpdateEvent(); // Use a factory aqui

  const { event } = await useCase.execute({
    eventId: id,
    title,
    description,
    date,
  });

    return reply.status(200).send(event);
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(400).send({ message: err.message });
    }
    return reply.status(500).send({ message: "Erro interno ao atualizar evento." });
  }
}