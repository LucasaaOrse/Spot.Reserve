import type { EventRepository } from "../../../domain/repositories/event-repository";
import type { ReservationRepository } from "../../../domain/repositories/reservation-repository";

interface GetEventLayoutRequest {
  eventId: string;
  currentUserId?: string; // opcional — se informado, marca o assento do próprio usuário
}

export class GetEventLayoutUseCase {
  constructor(
    private eventRepository: EventRepository,
    private reservationRepository: ReservationRepository
  ) {}

  async execute({ eventId, currentUserId }: GetEventLayoutRequest) {
    const event = await this.eventRepository.getEventLayout(eventId);

    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    // Busca a reserva do usuário logado neste evento (se houver)
    let myReservationSeatId: string | null = null;
    if (currentUserId) {
      const myReservation = await this.reservationRepository.findByEventAndUser(
        eventId,
        currentUserId
      );
      myReservationSeatId = myReservation?.seatId ?? null;
    }

    return {
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        myReservationSeatId, // null se usuário não tem reserva ou não está logado como guest
        tables: event.tables.map((table) => {
          const allSeatsOccupied = table.seats.every(
            (seat) => seat.reservations.length > 0
          );

          return {
            id: table.id,
            name: table.name,
            x: table.coord_x,
            y: table.coord_y,
            isFull: allSeatsOccupied,
            seats: table.seats.map((seat) => ({
              id: seat.id,
              label: seat.label,
              isOccupied: seat.reservations.length > 0,
              isMine: seat.id === myReservationSeatId,
            })),
          };
        }),
      },
    };
  }
}
