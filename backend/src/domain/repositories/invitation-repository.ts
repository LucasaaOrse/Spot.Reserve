

export type InvitationStatus = "PENDING" | "ACCEPTED";
export interface Invitation {
  id: string;
  email: string;
  token: string;
  eventId: string;
  guestId: string | null;
  status: InvitationStatus;
}

export interface InvitationRepository {
  create(data: {
    email: string;
    token: string;
    eventId: string;
  }): Promise<Invitation>;
  findByToken(token: string): Promise<Invitation | null>;
  findByEmailAndEvent(email: string, eventId: string): Promise<Invitation | null>;
  accept(params: {
    invitationId: string;
    guestId: string;
  }): Promise<Invitation>;
   findAcceptedByGuestAndEvent(
    guestId: string,
    eventId: string
  ): Promise<Invitation | null>;

  accept(params: {
    invitationId: string;
    guestId: string;
  }): Promise<Invitation>;
}