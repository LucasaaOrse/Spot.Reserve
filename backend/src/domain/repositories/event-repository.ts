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

// Dados ricos para listagem do organizador
export interface EventWithDetails {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  organizerId: string;
  locationId: string;
  locationName: string;
  locationAddress: string;
  maxTables: number;
  maxSeatsPerTable: number;
  tablesCount: number;
  invitationsCount: number;
  reservationsCount: number;
}

// Dados do evento com location para o preview do convite
export interface EventWithLocation {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  locationName: string;
  locationAddress: string;
}

export interface EventRepository {
  create(event: Event): Promise<void>;
  findById(id: string): Promise<Event | null>;
  findByIdWithLocation(id: string): Promise<EventWithLocation | null>;
  findManyByOrganizerId(organizerId: string): Promise<Event[]>;
  findManyByOrganizerIdWithDetails(organizerId: string): Promise<EventWithDetails[]>;
  findByLocationAndDate(locationId: string, date: Date): Promise<Event | null>;
  save(event: Event): Promise<void>;
  delete(id: string): Promise<void>;
  getEventLayout(eventId: string): Promise<EventLayout | null>;
}
