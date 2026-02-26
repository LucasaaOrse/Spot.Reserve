import { GetInvitationPreviewUseCase } from "../../../application/use-cases/invitation/get-invitation-preview";
import { PrismaInvitationRepository } from "../../../infra/database/prisma-invitation-repository";
import { PrismaEventRepository } from "../../../infra/database/prisma-event-repository";

export function makeGetInvitationPreviewUseCase() {
  const invitationRepository = new PrismaInvitationRepository();
  const eventRepository = new PrismaEventRepository();

  return new GetInvitationPreviewUseCase(invitationRepository, eventRepository);
}
