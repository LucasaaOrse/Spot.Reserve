import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSwitchReservationSeatUseCase } from "../../../../main/factories/reservation/make-switch-reservation-seat";

export async function switchReservationSeatController(
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
    const useCase = makeSwitchReservationSeatUseCase();
    const { reservation } = await useCase.execute({
      eventId,
      userId,
      newSeatId: seatId,
    });

    return reply.status(200).send({ reservationId: reservation.id });
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(400).send({ message: err.message });
    }

    return reply
      .status(500)
      .send({ message: "Erro interno ao trocar assento." });
  }
}
