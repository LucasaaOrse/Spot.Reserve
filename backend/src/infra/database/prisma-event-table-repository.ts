// src/infra/database/prisma-event-table-repository.ts
import { prisma } from "./prisma"; // sua instância do prisma
import type { EventTableRepository, EventTableWithSeatsInput } from "../../domain/repositories/event-table-repository";

export class PrismaEventTableRepository implements EventTableRepository {
  async countByEventId(eventId: string): Promise<number> {
    return await prisma.eventTable.count({
      where: { eventId },
    });
  }

  async createManyWithSeats(tables: EventTableWithSeatsInput[]): Promise<void> {
    const queries = tables.map((table) => 
      prisma.eventTable.create({
        data: {
          eventId: table.eventId,
          name: table.name,
          coord_x: table.coord_x,
          coord_y: table.coord_y,
          seats: {
            create: table.seats, // O Prisma cria os assentos automaticamente
          },
        },
      })
    );

    await prisma.$transaction(queries);
  }
}