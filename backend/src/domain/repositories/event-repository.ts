import { Event } from "../entities/event";

export interface EventLayout {
  id: string;
  title: string;
  date: Date;
  location: {
    name: string;
    address: string;
  };
  tables: Array<{
    id: string;
    name: string;
    coord_x: number;
    coord_y: number;
    seats: Array<{
      id: string;
      label: string;
      reservations: Array<{ id: string }>;
    }>;
  }>;
}

export interface EventRepository {
  create(event: Event): Promise<void>;
  findById(id: string): Promise<Event | null>;
  findManyByOrganizerId(organizerId: string): Promise<Event[]>;
  findByLocationAndDate(spaceId: string, date: Date): Promise<Event | null>;
  save(event: Event): Promise<void>;
  delete(id: string): Promise<void>;
  getEventLayout(eventId: string): Promise<EventLayout | null>;
}