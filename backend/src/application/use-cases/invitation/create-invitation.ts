// src/application/use-cases/invitation/create-invitation.ts
import { randomBytes } from "node:crypto";
import type { InvitationRepository } from "../../../domain/repositories/invitation-repository";
import type { EventRepository } from "../../../domain/repositories/event-repository";

interface CreateInvitationsRequest {
  eventId: string;
  organizerId: string;
  emails: string[];
}

interface CreateInvitationsResponse {
  created: Array<{ email: string; token: string }>;
  skipped: Array<{ email: string; reason: string }>;
}

export class CreateInvitationUseCase {
  constructor(
    private invitationRepository: InvitationRepository,
    private eventRepository: EventRepository
  ) {}

  async execute({
    eventId,
    organizerId,
    emails,
  }: CreateInvitationsRequest): Promise<CreateInvitationsResponse> {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    if (event.organizerId !== organizerId) {
      throw new Error("Acesso negado: evento não pertence ao organizador.");
    }

    const uniqueNormalizedEmails = Array.from(
      new Set(emails.map((email) => email.trim().toLowerCase()))
    );

    const created: Array<{ email: string; token: string }> = [];
    const skipped: Array<{ email: string; reason: string }> = [];

    for (const email of uniqueNormalizedEmails) {
      const alreadyInvited = await this.invitationRepository.findByEmailAndEvent(
        email,
        eventId
      );

      if (alreadyInvited && alreadyInvited.status === "PENDING") {
        skipped.push({ email, reason: "Convite pendente já existe." });
        continue;
      }

      const token = randomBytes(16).toString("hex");

      const invitation = await this.invitationRepository.create({
        email,
        eventId,
        token,
      });

      created.push({ email: invitation.email, token: invitation.token });
    }

    return { created, skipped };
  }
}