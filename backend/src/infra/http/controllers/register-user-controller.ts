import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeRegisterUser } from "../../../main/factories/make-register-user";

export async function registerUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  const registerUser = makeRegisterUser();

  // Endpoint público sempre cria ORGANIZER
  await registerUser.execute({ name, email, password, role: "ORGANIZER" });

  return reply.status(201).send();
}
