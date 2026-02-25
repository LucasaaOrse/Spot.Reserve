import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeRegisterUser } from "../../../main/factories/make-register-user";

export async function registerUserController(request: FastifyRequest, reply: FastifyReply) {
  // 1. Validação do Body
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["ADMIN", "ORGANIZER", "GUEST"]),
  });

  const { name, email, password, role } =
    registerBodySchema.parse(request.body);

  try {
    const registerUser = makeRegisterUser();

    await registerUser.execute({ name, email, password, role });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}