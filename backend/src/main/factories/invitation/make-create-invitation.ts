import { CreateInvitationUseCase } from "../../../application/use-cases/invitation/create-invitation";
import { PrismaEventRepository } from "../../../infra/database/prisma-event-repository";
import { PrismaInvitationRepository } from "../../../infra/database/prisma-invitation-repository";

export function makeCreateInvitationUseCase() {
  const invitationRepository = new PrismaInvitationRepository();
  const eventRepository = new PrismaEventRepository();

  return new CreateInvitationUseCase(invitationRepository, eventRepository);
}
