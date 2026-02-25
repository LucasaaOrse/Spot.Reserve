import { prisma } from "./prisma";
import { Space } from "../../domain/entities/space";
import type { SpaceRepository } from "../../domain/repositories/space-repository";

export class PrismaSpaceRepository implements SpaceRepository {
  private prisma = prisma;

  async create(space: Space): Promise<void> {
    await this.prisma.space.create({ 
      data: 
      {
        id: space.id,
        name: space.name,
        locationId: space.locationId,
        total_area: space.totalArea ?? null
      }
      
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.space.delete({ where: { id } });
  }

  async update(space: Space): Promise<void> {
    await this.prisma.space.update({ where: { id: space.id }, 
      data: {
        name: space.name,
        locationId: space.locationId,
        total_area: space.totalArea ?? null
      } });
  }

  async findById(id: string): Promise<Space | null> {
   const data = await this.prisma.space.findUnique({ where: { id } });

    if (!data) return null;

    return Space.create(
      {
        name: data.name,
        locationId: data.locationId,
        totalArea: data.total_area
      }, data.id
    );

  }

  async findAll(): Promise<Space[]> {
    const spaces = await this.prisma.space.findMany({});

    return spaces.map((data) => Space.create(
      {
        name: data.name,
        locationId: data.locationId,
        totalArea: data.total_area
      }, data.id
    ));
  }

  async findByLocationId(locationId: string): Promise<Space[]> {
    const spaces = await this.prisma.space.findMany({ where: { locationId } });

    
    return spaces.map((data) => Space.create(
      {
        name: data.name,
        locationId: data.locationId,
        totalArea: data.total_area
      }, data.id
    ));
  }

}