import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AuthenticateUser } from "../../../application/use-cases/authenticate-user";
import { PrismaUserRepository } from "../../database/prisma-user-repository";
import { AppError } from "../../../application/errors/app-error";

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

    const userRepository = new PrismaUserRepository();
    const authenticateUser = new AuthenticateUser(userRepository);

    try {
    const { user } = await authenticateUser.execute({ email, password });

    // Gera o token contendo a ROLE do usuário
    const token = await reply.jwtSign(
      { role: user.role }, 
      { sign: { sub: user.id as string } }
    );

    return reply.status(200).send({ token });
  }  catch {
    throw new AppError("Invalid credentials.", 401);
  }
}
