import { prisma } from "./prisma";
import type {
  Reservation,
  ReservationRepository,
} from "../../domain/repositories/reservation-repository";

function toDomainReservation(data: {
  id: string;
  eventId: string;
  userId: string;
  seatId: string;
}): Reservation {
  return {
    id: data.id,
    eventId: data.eventId,
    userId: data.userId,
    seatId: data.seatId,
  };
}

export class PrismaReservationRepository implements ReservationRepository {
  async create(params: {
    eventId: string;
    userId: string;
    seatId: string;
  }): Promise<Reservation> {
    const created = await prisma.reservation.create({
      data: {
        eventId: params.eventId,
        userId: params.userId,
        seatId: params.seatId,
      },
    });

    return toDomainReservation(created);
  }

  async findByEventAndSeat(
    eventId: string,
    seatId: string
  ): Promise<Reservation | null> {
    const reservation = await prisma.reservation.findFirst({
      where: { eventId, seatId },
    });

    if (!reservation) return null;
    return toDomainReservation(reservation);
  }

  async findByEventAndUser(
    eventId: string,
    userId: string
  ): Promise<Reservation | null> {
    const reservation = await prisma.reservation.findFirst({
      where: { eventId, userId },
    });

    if (!reservation) return null;
    return toDomainReservation(reservation);
  }

  async seatBelongsToEvent(eventId: string, seatId: string): Promise<boolean> {
    const seat = await prisma.eventSeat.findFirst({
      where: {
        id: seatId,
        table: {
          eventId,
        },
      },
      select: { id: true },
    });

    return Boolean(seat);
  }

  async switchSeat(params: {
    eventId: string;
    userId: string;
    newSeatId: string;
  }): Promise<Reservation> {
    return await prisma.$transaction(async (tx: any) => {
      const current = await tx.reservation.findFirst({
        where: {
          eventId: params.eventId,
          userId: params.userId,
        },
      });

      if (!current) {
        throw new Error("Reserva não encontrada para o usuário neste evento.");
      }

      await tx.reservation.delete({
        where: { id: current.id },
      });

      const created = await tx.reservation.create({
        data: {
          eventId: params.eventId,
          userId: params.userId,
          seatId: params.newSeatId,
        },
      });

      return toDomainReservation(created);
    });
  }
}
