import { prisma } from "./prisma";
import { Event } from "../../domain/entities/event";
import { type EventRepository } from "../../domain/repositories/event-repository";

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

  async findManyByOrganizerId(organizerId: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
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

  async findByLocationAndDate(
    locationId: string,
    date: Date
  ): Promise<Event | null> {
    const event = await this.prisma.event.findFirst({
      where: {
        locationId,
        date,
      },
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
    await this.prisma.event.delete({
      where: { id },
    });
  }

  async getEventLayout(eventId: string) {
  return await this.prisma.event.findUnique({
    where: { id: eventId },
    include: {
      location: true,
      tables: {
        include: {
          seats: {
            include: {
              reservations: {
                select: { id: true } // Só precisamos saber se existe
              }
            }
          }
        }
      }
    }
  });
}
}