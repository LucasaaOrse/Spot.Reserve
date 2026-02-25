import { AcceptInvitationUseCase } from "../../../application/use-cases/invitation/accept-invitation";
import { PrismaInvitationRepository } from "../../../infra/database/prisma-invitation-repository";

export function makeAcceptInvitationUseCase() {
  const invitationRepository = new PrismaInvitationRepository();

  return new AcceptInvitationUseCase(invitationRepository);
}
