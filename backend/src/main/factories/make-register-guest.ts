import { RegisterGuestUseCase } from "../../application/use-cases/register-guest";
import { PrismaUserRepository } from "../../infra/database/prisma-user-repository";
import { PrismaInvitationRepository } from "../../infra/database/prisma-invitation-repository";

export function makeRegisterGuest() {
  const userRepository = new PrismaUserRepository();
  const invitationRepository = new PrismaInvitationRepository();

  return new RegisterGuestUseCase(userRepository, invitationRepository);
}
