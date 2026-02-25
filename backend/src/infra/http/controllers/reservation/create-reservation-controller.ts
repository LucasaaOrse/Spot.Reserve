import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateReservationUseCase } from "../../../../main/factories/reservation/make-create-reservation";

export async function createReservationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    eventId: z.string().uuid(),
  });

  const bodySchema = z.object({
    seatId: z.string().uuid(),
  });

  const { eventId } = paramsSchema.parse(request.params);
  const { seatId } = bodySchema.parse(request.body);
  const userId = (request.user as { sub: string }).sub;

  try {
    const useCase = makeCreateReservationUseCase();
    const { reservation } = await useCase.execute({
      eventId,
      userId,
      seatId,
    });

    return reply.status(201).send({ reservationId: reservation.id });
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(400).send({ message: err.message });
    }

    return reply
      .status(500)
      .send({ message: "Erro interno ao criar reserva." });
  }
}
