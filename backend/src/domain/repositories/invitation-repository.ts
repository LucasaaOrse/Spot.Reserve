// src/domain/repositories/invitation-repository.ts
export interface Invitation {
  id: string;
  email: string;
  token: string;
  eventId: string;
  status: 'PENDING' | 'ACCEPTED';
}

export interface InvitationRepository {
  create(data: Omit<Invitation, 'id' | 'status'>): Promise<Invitation>;
  findByToken(token: string): Promise<Invitation | null>;
  findByEmailAndEvent(email: string, eventId: string): Promise<Invitation | null>;
}