import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetInvitationPreviewUseCase } from "../../../../main/factories/invitation/make-get-invitation-preview";

export async function getInvitationPreviewController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const querySchema = z.object({
    token: z.string().min(10, "Token inválido."),
  });

  const { token } = querySchema.parse(request.query);

  const useCase = makeGetInvitationPreviewUseCase();
  const result = await useCase.execute({ token });

  return reply.status(200).send(result);
}
