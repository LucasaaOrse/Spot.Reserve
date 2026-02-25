import type { FastifyInstance } from "fastify";
import { acceptInvitationController } from "../controllers/invitation/accept-invitation-controller";
import { verifyJWT } from "../middlewares/verify-jwt";

export async function invitationRoutes(app: FastifyInstance) {
  app.post(
    "/invitations/accept",
    {
      onRequest: [verifyJWT],
      schema: {
        summary: "Aceitar convite de evento",
        tags: ["Invitations"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["token"],
          properties: {
            token: { type: "string", minLength: 10 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              invitationId: { type: "string" },
              eventId: { type: "string" },
              status: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    acceptInvitationController
  );
}
