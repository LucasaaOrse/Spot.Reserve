import type { InvitationRepository } from "../../../domain/repositories/invitation-repository";

interface AcceptInvitationRequest {
  token: string;
  userId: string;
  userEmail: string;
}

export class AcceptInvitationUseCase {
  constructor(private invitationRepository: InvitationRepository) {}

  async execute({ token, userId, userEmail }: AcceptInvitationRequest) {
    const invitation = await this.invitationRepository.findByToken(token);

    if (!invitation) {
      throw new Error("Convite inválido.");
    }

    if (invitation.status === "ACCEPTED") {
      if (invitation.guestId === userId) {
        return { invitation };
      }

      throw new Error("Este convite já foi utilizado.");
    }

    if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
      throw new Error("O e-mail do usuário não corresponde ao convite.");
    }

    const accepted = await this.invitationRepository.accept({
      invitationId: invitation.id,
      guestId: userId,
    });

    return { invitation: accepted };
  }
}
