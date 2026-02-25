import { prisma } from "./prisma";
import { Location } from "../../domain/entities/location";
import type { LocationRepository } from "../../domain/repositories/location-repository";

export class PrismaLocationRepository implements LocationRepository {
  private prisma = prisma;

  async create(location: Location): Promise<void> {
    await this.prisma.location.create({
      data: {
        id: location.id,
        name: location.name,
        address: location.address,
        maxTables: location.maxTables,
        maxSeatsPerTable: location.maxSeatsPerTable,
      },
    });
  }

  async findById(id: string): Promise<Location | null> {
    const location = await this.prisma.location.findUnique({
      where: { id },
    });

    if (!location) return null;

    return new Location(
      {
        name: location.name,
        address: location.address,
        maxTables: location.maxTables,
        maxSeatsPerTable: location.maxSeatsPerTable,
      },
      location.id
    );
  }

  async findAll(): Promise<Location[]> {
    const locations = await this.prisma.location.findMany();

    return locations.map(
      (location) =>
        new Location(
          {
            name: location.name,
            address: location.address,
            maxTables: location.maxTables,
            maxSeatsPerTable: location.maxSeatsPerTable,
          },
          location.id
        )
    );
  }

  async update(location: Location): Promise<void> {
    await this.prisma.location.update({
      where: { id: location.id },
      data: {
        name: location.name,
        address: location.address,
        maxTables: location.maxTables,
        maxSeatsPerTable: location.maxSeatsPerTable,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.location.delete({
      where: { id },
    });
  }
}