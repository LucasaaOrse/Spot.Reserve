import type { FastifyInstance } from "fastify";
import { acceptInvitationController } from "../controllers/invitation/accept-invitation-controller";
import { getInvitationPreviewController } from "../controllers/invitation/get-invitation-preview-controller";
import { verifyJWT } from "../middlewares/verify-jwt";

export async function invitationRoutes(app: FastifyInstance) {
  // Público: ver detalhes do evento pelo token (antes de criar conta)
  app.get("/invitations/preview", {
    schema: {
      summary: "Ver detalhes do evento pelo token de convite (sem login)",
      tags: ["Invitations"],
      querystring: {
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
            invitation: {
              type: "object",
              properties: {
                token: { type: "string" },
                email: { type: "string" },
                status: { type: "string" },
              },
            },
            event: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                description: { type: "string", nullable: true },
                date: { type: "string", format: "date-time" },
                location: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    address: { type: "string" },
                  },
                },
              },
            },
          },
        },
        400: {
          type: "object",
          properties: { message: { type: "string" } },
        },
        404: {
          type: "object",
          properties: { message: { type: "string" } },
        },
      },
    },
  }, getInvitationPreviewController);

  // Autenticado: aceitar convite (para quem JÁ tem conta)
  app.post("/invitations/accept", {
    onRequest: [verifyJWT],
    schema: {
      summary: "Aceitar convite de evento (usuário já cadastrado)",
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
          properties: { message: { type: "string" } },
        },
      },
    },
  }, acceptInvitationController);
}
