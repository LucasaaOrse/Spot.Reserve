import type { FastifyInstance } from "fastify";
import { registerUserController } from "../controllers/register-user-controller";
import { registerGuestController } from "../controllers/register-guest-controller";
import { authenticateController } from "../controllers/authenticate-controller";

export async function userRoutes(app: FastifyInstance) {
  // Cadastro de ORGANIZADOR (público)
  app.post("/users", {
    schema: {
      summary: "Criar conta de organizador",
      tags: ["Users"],
      body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
      response: {
        201: { description: "Organizador criado com sucesso", type: "null" },
        400: {
          type: "object",
          properties: { message: { type: "string" } },
        },
      },
    },
  }, registerUserController);

  // Cadastro de GUEST via token de convite (público)
  app.post("/users/guest", {
    schema: {
      summary: "Criar conta de convidado via token de convite",
      tags: ["Users"],
      body: {
        type: "object",
        required: ["name", "email", "password", "invitationToken"],
        properties: {
          name: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          invitationToken: { type: "string", minLength: 10 },
        },
      },
      response: {
        201: {
          description: "Conta criada e convite aceito automaticamente",
          type: "object",
          properties: {
            userId: { type: "string" },
            eventId: { type: "string" },
          },
        },
        400: {
          type: "object",
          properties: { message: { type: "string" } },
        },
        409: {
          type: "object",
          properties: { message: { type: "string" } },
        },
      },
    },
  }, registerGuestController);

  // Autenticação (público)
  app.post("/sessions", {
    schema: {
      summary: "Autenticar usuário (qualquer role)",
      tags: ["Sessions"],
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
      response: {
        200: {
          type: "object",
          properties: { token: { type: "string" } },
        },
        401: {
          type: "object",
          properties: { message: { type: "string" } },
        },
      },
    },
  }, authenticateController);
}
