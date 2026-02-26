import { User } from "../../domain/entities/user";
import type { UserRepository } from "../../domain/repositories/user-repository";
import type { InvitationRepository } from "../../domain/repositories/invitation-repository";
import bcrypt from "bcryptjs";
import { AppError } from "../errors/app-error";

interface RegisterGuestRequest {
  name: string;
  email: string;
  password: string;
  invitationToken: string;
}

export class RegisterGuestUseCase {
  constructor(
    private userRepository: UserRepository,
    private invitationRepository: InvitationRepository
  ) {}

  async execute({ name, email, password, invitationToken }: RegisterGuestRequest) {
    // 1. Valida o convite
    const invitation = await this.invitationRepository.findByToken(invitationToken);

    if (!invitation) {
      throw new AppError("Convite inválido ou não encontrado.", 400);
    }

    if (invitation.status === "ACCEPTED") {
      throw new AppError("Este convite já foi utilizado.", 400);
    }

    // 2. Valida que o email bate com o convite
    if (invitation.email.toLowerCase() !== email.trim().toLowerCase()) {
      throw new AppError(
        "O e-mail informado não corresponde ao convite. Use o e-mail para o qual o convite foi enviado.",
        400
      );
    }

    // 3. Verifica se já existe conta com esse email
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(
        "Já existe uma conta com este e-mail. Faça login e aceite o convite.",
        409
      );
    }

    // 4. Cria o usuário como GUEST
    const passwordHash = await bcrypt.hash(password, 6);

    const user = new User({
      name,
      email: email.trim().toLowerCase(),
      passwordHash,
      role: "GUEST",
    });

    await this.userRepository.create(user);

    // 5. Aceita o convite automaticamente
    const acceptedInvitation = await this.invitationRepository.accept({
      invitationId: invitation.id,
      guestId: user.id as string,
    });

    return { user, invitation: acceptedInvitation };
  }
}
