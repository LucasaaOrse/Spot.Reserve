import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeRegisterGuest } from "../../../main/factories/make-register-guest";

export async function registerGuestController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    invitationToken: z.string().min(10, "Token de convite inválido."),
  });

  const { name, email, password, invitationToken } = bodySchema.parse(request.body);

  const useCase = makeRegisterGuest();

  const { user, invitation } = await useCase.execute({
    name,
    email,
    password,
    invitationToken,
  });

  return reply.status(201).send({
    userId: user.id,
    eventId: invitation.eventId,
  });
}
