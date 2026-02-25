import type { FastifyInstance } from "fastify";
import { createEventController } from "../controllers/event/create-event-controller";
import { getEventByIdController } from "../controllers/event/getById-event-controller";
import { listEventsByOrganizerController } from "../controllers/event/list-event-controller";
import { updateEventController } from "../controllers/event/update-event-controller";
import { verifyJWT } from "../middlewares/verify-jwt";
import { verifyUserRole } from "../middlewares/verify-user-role";
import { createEventTablesController } from "../controllers/event-table/create-event-tables-controller";

// Objeto reutilizável atualizado: trocado spaceId por locationId
const eventResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    title: { type: "string" },
    description: { type: "string", nullable: true },
    date: { type: "string", format: "date-time" },
    organizerId: { type: "string", format: "uuid" },
    locationId: { type: "string", format: "uuid" }, // Mudança aqui
  },
};

export async function eventRoutes(app: FastifyInstance) {

  app.addHook("onRequest", verifyJWT);
  
  // CREATE
  app.post("/events", {
    onRequest: verifyUserRole("ORGANIZER"),
    schema: {
      summary: "Criar um novo evento",
      tags: ["Event"],
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["title", "date", "locationId"], // Mudança aqui
        properties: {
          title: { type: "string", minLength: 5 },
          description: { type: "string", nullable: true },
          date: { type: "string", format: "date-time" },
          locationId: { type: "string", format: "uuid" }, // Mudança aqui
        },
      },
      response: {
        201: {
          description: "Evento criado",
          type: "object",
          properties: { eventId: { type: "string" } },
        },
      },
    }
  }, createEventController);

  // GET BY ID
  app.get("/events/:id", {
    schema: {
      summary: "Obter detalhes de um evento",
      tags: ["Event"],
      params: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" }
        }
      },
      response: {
        200: eventResponseSchema,
        404: {
          description: "Evento não encontrado",
          type: "object",
          properties: { message: { type: "string" } }
        }
      }
    }
  }, getEventByIdController);

  // LIST BY ORGANIZER
  app.get("/events", {
    onRequest: [verifyUserRole("ORGANIZER")],
    schema: {
      summary: "Listar eventos do organizador logado",
      security: [{ bearerAuth: [] }],
      tags: ["Event"],
      response: {
        200: {
          type: "array",
          items: eventResponseSchema
        }
      }
    }
  }, listEventsByOrganizerController);

  // UPDATE
  app.put("/events/:id", {
    onRequest: [verifyUserRole("ORGANIZER")],
    schema: {
      summary: "Atualizar um evento existente",
      tags: ["Event"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" }
        }
      },
      body: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 5 },
          description: { type: "string", nullable: true },
          date: { type: "string", format: "date-time" },
        },
      },
      response: {
        200: eventResponseSchema,
        400: {
          description: "Dados inválidos",
          type: "object",
          properties: { message: { type: "string" } }
        }
      }
    }
  }, updateEventController);
  app.post(
  "/events/:eventId/tables",
  {
    onRequest: [verifyJWT, verifyUserRole("ORGANIZER")],
    schema: {
      summary: "Adicionar mesas e assentos ao evento",
      tags: ["Tables"],
      params: {
        type: "object",
        properties: { eventId: { type: "string", format: "uuid" } }
      },
      body: {
        type: "object",
        required: ["tables"],
        properties: {
          tables: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                coord_x: { type: "number" },
                coord_y: { type: "number" }
              }
            }
          }
        }
      }
    }
  },
  createEventTablesController
);
}