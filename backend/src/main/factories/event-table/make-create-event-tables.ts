import { PrismaEventRepository } from "../../../infra/database/prisma-event-repository";
import { PrismaLocationRepository } from "../../../infra/database/prisma-location-repository";
import { PrismaEventTableRepository } from "../../../infra/database/prisma-event-table-repository";
import { CreateEventTablesUseCase } from "../../../application/use-cases/event-table/create-event-tables";

export function makeCreateEventTables() {
  const eventRepository = new PrismaEventRepository();
  const locationRepository = new PrismaLocationRepository();
  const tableRepository = new PrismaEventTableRepository();

  return new CreateEventTablesUseCase(
    eventRepository,
    locationRepository,
    tableRepository
  );
}