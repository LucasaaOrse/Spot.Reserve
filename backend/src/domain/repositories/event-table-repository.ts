export interface EventTableWithSeatsInput {
  eventId: string;
  name: string;
  coord_x: number;
  coord_y: number;
  seats: { label: string }[];
}

export interface EventTableRepository {
  countByEventId(eventId: string): Promise<number>;
  createManyWithSeats(tables: EventTableWithSeatsInput[]): Promise<void>;
}