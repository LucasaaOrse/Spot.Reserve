import type { InvitationRepository } from "../../../domain/repositories/invitation-repository";
import type { EventRepository } from "../../../domain/repositories/event-repository";
import { AppError } from "../../errors/app-error";

interface GetInvitationPreviewRequest {
  token: string;
}

export class GetInvitationPreviewUseCase {
  constructor(
    private invitationRepository: InvitationRepository,
    private eventRepository: EventRepository
  ) {}

  async execute({ token }: GetInvitationPreviewRequest) {
    const invitation = await this.invitationRepository.findByToken(token);

    if (!invitation) {
      throw new AppError("Convite inválido ou não encontrado.", 404);
    }

    if (invitation.status === "ACCEPTED") {
      throw new AppError("Este convite já foi utilizado.", 400);
    }

    const event = await this.eventRepository.findByIdWithLocation(invitation.eventId);

    if (!event) {
      throw new AppError("Evento associado ao convite não encontrado.", 404);
    }

    return {
      invitation: {
        token: invitation.token,
        email: invitation.email,
        status: invitation.status,
      },
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: {
          name: event.locationName,
          address: event.locationAddress,
        },
      },
    };
  }
}
