import { prisma } from "./prisma";
import { Event } from "../../domain/entities/event";
import type {
  EventRepository,
  EventLayout,
  EventWithDetails,
  EventWithLocation,
} from "../../domain/repositories/event-repository";

export class PrismaEventRepository implements EventRepository {
  private prisma = prisma;

  async create(event: Event): Promise<void> {
    await this.prisma.event.create({
      data: {
        id: event.id,
        title: event.title,
        description: event.description ?? null,
        date: event.date,
        organizerId: event.organizerId,
        locationId: event.locationId,
      },
    });
  }

  async findById(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) return null;

    return new Event(
      {
        title: event.title,
        description: event.description,
        date: event.date,
        organizerId: event.organizerId,
        locationId: event.locationId,
      },
      event.id
    );
  }

  async findByIdWithLocation(id: string): Promise<EventWithLocation | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { location: true },
    });

    if (!event) return null;

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      locationName: event.location.name,
      locationAddress: event.location.address,
    };
  }

  async findManyByOrganizerId(organizerId: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
      orderBy: { date: "asc" },
    });

    return events.map(
      (event) =>
        new Event(
          {
            title: event.title,
            description: event.description,
            date: event.date,
            organizerId: event.organizerId,
            locationId: event.locationId,
          },
          event.id
        )
    );
  }

  async findManyByOrganizerIdWithDetails(organizerId: string): Promise<EventWithDetails[]> {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
      orderBy: { date: "asc" },
      include: {
        location: true,
        _count: {
          select: {
            tables: true,
            invitations: true,
            reservations: true,
          },
        },
      },
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      organizerId: event.organizerId,
      locationId: event.locationId,
      locationName: event.location.name,
      locationAddress: event.location.address,
      maxTables: event.location.maxTables,
      maxSeatsPerTable: event.location.maxSeatsPerTable,
      tablesCount: event._count.tables,
      invitationsCount: event._count.invitations,
      reservationsCount: event._count.reservations,
    }));
  }

  async findByLocationAndDate(locationId: string, date: Date): Promise<Event | null> {
    const event = await this.prisma.event.findFirst({
      where: { locationId, date },
    });

    if (!event) return null;

    return new Event(
      {
        title: event.title,
        description: event.description,
        date: event.date,
        organizerId: event.organizerId,
        locationId: event.locationId,
      },
      event.id
    );
  }

  async save(event: Event): Promise<void> {
    await this.prisma.event.update({
      where: { id: event.id },
      data: {
        title: event.title,
        description: event.description ?? null,
        date: event.date,
      },
    });
  }

  async delete(id: string): Promise<void> {
    // Deleta em cascata: reservations → seats → tables → invitations → event
    await this.prisma.$transaction([
      this.prisma.reservation.deleteMany({
        where: { eventId: id },
      }),
      this.prisma.eventSeat.deleteMany({
        where: { table: { eventId: id } },
      }),
      this.prisma.eventTable.deleteMany({
        where: { eventId: id },
      }),
      this.prisma.invitation.deleteMany({
        where: { eventId: id },
      }),
      this.prisma.event.delete({
        where: { id },
      }),
    ]);
  }

  async getEventLayout(eventId: string): Promise<EventLayout | null> {
    return await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        location: true,
        tables: {
          include: {
            seats: {
              include: {
                reservations: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });
  }
}
