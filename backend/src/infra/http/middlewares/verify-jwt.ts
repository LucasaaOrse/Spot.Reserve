import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../../application/errors/app-error";

export async function verifyJWT(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    throw new AppError("Não autorizado. Token ausente ou inválido.", 401);
}  
}