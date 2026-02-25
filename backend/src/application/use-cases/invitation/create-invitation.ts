// src/application/use-cases/invitation/create-invitation.ts
import { randomBytes } from "node:crypto";
import type { InvitationRepository } from "../../../domain/repositories/invitation-repository";
import type { EventRepository } from "../../../domain/repositories/event-repository";

export class CreateInvitationUseCase {
  constructor(
    private invitationRepository: InvitationRepository,
    private eventRepository: EventRepository
  ) {}

  async execute({ email, eventId }: { email: string; eventId: string }) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new Error("Evento não encontrado.");

    const alreadyInvited = await this.invitationRepository.findByEmailAndEvent(email, eventId);
    if (alreadyInvited) throw new Error("Este convidado já recebeu um convite.");

    const token = randomBytes(16).toString("hex");

    const invitation = await this.invitationRepository.create({
      email,
      eventId,
      token,
    });

    return { invitation };
  }
}