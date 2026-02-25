import { prisma } from "./prisma";
import type {
  Invitation,
  InvitationRepository,
} from "../../domain/repositories/invitation-repository";

function toDomainInvitation(data: {
  id: string;
  email: string;
  token: string;
  eventId: string;
  guestId: string | null;
  status: string;
}): Invitation {
  return {
    id: data.id,
    email: data.email,
    token: data.token,
    eventId: data.eventId,
    guestId: data.guestId,
    status: data.status === "ACCEPTED" ? "ACCEPTED" : "PENDING",
  };
}

export class PrismaInvitationRepository implements InvitationRepository {
  async create(data: {
    email: string;
    token: string;
    eventId: string;
  }): Promise<Invitation> {
    const invitation = await prisma.invitation.create({
      data: {
        email: data.email,
        token: data.token,
        eventId: data.eventId,
        status: "PENDING",
      },
    });

    return toDomainInvitation(invitation);
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) return null;
    return toDomainInvitation(invitation);
  }

  async findByEmailAndEvent(
    email: string,
    eventId: string
  ): Promise<Invitation | null> {
    const invitation = await prisma.invitation.findFirst({
      where: { email, eventId },
      orderBy: { id: "desc" },
    });

    if (!invitation) return null;
    return toDomainInvitation(invitation);
  }

  async findAcceptedByGuestAndEvent(
    guestId: string,
    eventId: string
  ): Promise<Invitation | null> {
    const invitation = await prisma.invitation.findFirst({
      where: {
        guestId,
        eventId,
        status: "ACCEPTED",
      },
      orderBy: { id: "desc" },
    });

    if (!invitation) return null;
    return toDomainInvitation(invitation);
  }

  async accept(params: {
    invitationId: string;
    guestId: string;
  }): Promise<Invitation> {
    const invitation = await prisma.invitation.update({
      where: { id: params.invitationId },
      data: {
        status: "ACCEPTED",
        guestId: params.guestId,
      },
    });

    return toDomainInvitation(invitation);
  }
}