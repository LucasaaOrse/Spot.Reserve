import type { FastifyInstance } from "fastify";
import { registerUserController } from "../controllers/register-user-controller";
import { authenticateController } from "../controllers/authenticate-controller";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", {
    schema: {
      summary: "Criar um novo usuário",
      tags: ["Users"],
      body: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          role: { type: "string", enum: ["ADMIN", "ORGANIZER", "GUEST"] },
        },
      },
      response: {
        201: {
          description: "Usuário criado com sucesso",
          type: "null",
        },
        400: {
          description: "Erro de validação ou usuário já existente",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
  }, registerUserController);

  app.post("/sessions", {
    schema: {
      summary: "Autenticar um usuário",
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
          description: "Usuário autenticado com sucesso",
          type: "object",
          properties: {
            token: { type: "string" },
          },
        },
        400: {
          description: "Erro de validação ou usuário não encontrado",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
  }, authenticateController);

}

