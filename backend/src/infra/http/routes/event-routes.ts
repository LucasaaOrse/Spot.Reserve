import type { FastifyInstance } from "fastify";
import { createEventController } from "../controllers/event/create-event-controller";
import { getEventByIdController } from "../controllers/event/getById-event-controller";
import { listEventsByOrganizerController } from "../controllers/event/list-event-controller";
import { updateEventController } from "../controllers/event/update-event-controller";
import { deleteEventController } from "../controllers/event/delete-event-controller";
import { getEventLayoutController } from "../controllers/event/get-event-layout-controller";
import { createEventTablesController } from "../controllers/event-table/create-event-tables-controller";
import { createInvitationController } from "../controllers/invitation/create-invitation-controller";
import { createReservationController } from "../controllers/reservation/create-reservation-controller";
import { switchReservationSeatController } from "../controllers/reservation/switch-reservation-seat-controller";
import { cancelReservationController } from "../controllers/reservation/cancel-reservation-controller";
import { verifyJWT } from "../middlewares/verify-jwt";
import { verifyUserRole } from "../middlewares/verify-user-role";

export async function eventRoutes(app: FastifyInstance) {
  // ──────────────────────────────────────────────
  // ROTAS DO ORGANIZADOR
  // ──────────────────────────────────────────────

  // Criar evento
  app.post("/events", {
    onRequest: [verifyJWT, verifyUserRole("ORGANIZER")],
    schema: {
      summary: "Criar novo evento",
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["title", "date", "locationId"],
        properties: {
          title: { type: "string", minLength: 5 },
          description: { type: "string", nullable: true },
          date: { type: "string", format: "date-time" },
          locationId: { type: "string", format: "uuid" },
        },
      },
      response: {
        201: {
          type: "object",
          properties: { eventId: { type: "string" } },
        },
      },
    },
  }, createEventController);

  // Listar eventos do organizador logado
  app.get("/events", {
    onRequest: [verifyJWT, verifyUserRole("ORGANIZER")],
    schema: {
      summary: "Listar eventos do organizador logado",
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              description: { type: "string", nullable: true },
              date: { type: "string", format: "date-time" },
              organizerId: { type: "string" },
              locationId: { type: "string" },
              locationName: { type: "string" },
              locationAddress: { type: "string" },
              maxTables: { type: "integer" },
              maxSeatsPerTable: { type: "integer" },
              tablesCount: { type: "integer" },
              invitationsCount: { type: "integer" },
              reservationsCount: { type: "integer" },
            },
          },
        },
      },
    },
  }, listEventsByOrganizerController);

  // Buscar evento por ID (organizador vê o seu)
  app.get("/events/:id", {
    onRequest: [verifyJWT, verifyUserRole("ORGANIZER")],
    schema: {
      summary: "Buscar evento por ID",
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { id: { type: "string", format: "uuid" } },
      },
    },
  }, getEventByIdController);

  // Atualizar evento
  app.put("/events/:id", {
    onRequest: [verifyJWT, verifyUserRole("ORGANIZER")],
    schema: {
      summary: "Atualizar evento",
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { id: { type: "string", format: "uuid" } },
      },
      body: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 5 },
          description: { type: "string", nullable: true },
          date: { type: "string", format: "date-time" },
        },
      },
    },
  }, updateEventController);

  // Deletar evento
  app.delete("/events/:id", {
    onRequest: [verifyJWT, verifyUserRole("ORGANIZER")],
    schema: {
      summary: "Deletar evento (cascata: mesas, assentos, convites, reservas)",
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { id: { type: "string", format: "uuid" } },
      },
      response: {
        204: { description: "Evento deletado com sucesso", type: "null" },
        403: {
          type: "object",
          properties: { message: { type: "string" } },
        },
        404: {
          type: "object",
          properties: { message: { type: "string" } },
        },
      },
    },
  }, deleteEventController);

  // Adicionar mesas ao evento
  app.post("/events/:eventId/tables", {
    onRequest: [verifyJWT, verifyUserRole("ORGANIZER")],
    schema: {
      summary: "Adicionar mesas e assentos automáticos ao evento",
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { eventId: { type: "string", format: "uuid" } },
      },
      body: {
        type: "object",
        required: ["tables"],
        properties: {
          tables: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["name", "coord_x", "coord_y"],
              properties: {
                name: { type: "string" },
                coord_x: { type: "number" },
                coord_y: { type: "number" },
              },
            },
          },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            count: { type: "integer" },
            seatsPerTable: { type: "integer" },
            totalTables: { type: "integer" },
            maxTables: { type: "integer" },
          },
        },
      },
    },
  }, createEventTablesController);

  // Enviar convites para o evento
  app.post("/events/:eventId/invitations", {
    onRequest: [verifyJWT, verifyUserRole("ORGANIZER")],
    schema: {
      summary: "Enviar convites para o evento",
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { eventId: { type: "string", format: "uuid" } },
      },
      body: {
        type: "object",
        required: ["emails"],
        properties: {
          emails: {
            type: "array",
            minItems: 1,
            items: { type: "string", format: "email" },
          },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            created: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  token: { type: "string" },
                },
              },
            },
            skipped: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  reason: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  }, createInvitationController);

  // ──────────────────────────────────────────────
  // ROTAS PÚBLICAS (autenticado, qualquer role)
  // ──────────────────────────────────────────────

  // Layout do evento (usado por organizador E convidado)
  app.get("/events/:eventId/layout", {
    onRequest: [verifyJWT],
    schema: {
      summary: "Layout do evento com status de ocupação por assento",
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { eventId: { type: "string", format: "uuid" } },
      },
      response: {
        200: {
          type: "object",
          properties: {
            event: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                date: { type: "string", format: "date-time" },
                myReservationSeatId: { type: "string", nullable: true },
                location: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    address: { type: "string" },
                  },
                },
                tables: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      x: { type: "number" },
                      y: { type: "number" },
                      isFull: { type: "boolean" },
                      seats: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            label: { type: "string" },
                            isOccupied: { type: "boolean" },
                            isMine: { type: "boolean" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, getEventLayoutController);

  // ──────────────────────────────────────────────
  // ROTAS DO CONVIDADO (GUEST)
  // ──────────────────────────────────────────────

  // Reservar assento
  app.post("/events/:eventId/reservations", {
    onRequest: [verifyJWT, verifyUserRole("GUEST")],
    schema: {
      summary: "Reservar assento em evento",
      tags: ["Reservations"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { eventId: { type: "string", format: "uuid" } },
      },
      body: {
        type: "object",
        required: ["seatId"],
        properties: {
          seatId: { type: "string", format: "uuid" },
        },
      },
      response: {
        201: {
          type: "object",
          properties: { reservationId: { type: "string" } },
        },
      },
    },
  }, createReservationController);

  // Trocar assento
  app.patch("/events/:eventId/reservations/me", {
    onRequest: [verifyJWT, verifyUserRole("GUEST")],
    schema: {
      summary: "Trocar assento reservado",
      tags: ["Reservations"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { eventId: { type: "string", format: "uuid" } },
      },
      body: {
        type: "object",
        required: ["seatId"],
        properties: {
          seatId: { type: "string", format: "uuid" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: { reservationId: { type: "string" } },
        },
      },
    },
  }, switchReservationSeatController);

  // Cancelar reserva
  app.delete("/events/:eventId/reservations/me", {
    onRequest: [verifyJWT, verifyUserRole("GUEST")],
    schema: {
      summary: "Cancelar reserva no evento",
      tags: ["Reservations"],
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { eventId: { type: "string", format: "uuid" } },
      },
      response: {
        204: { description: "Reserva cancelada", type: "null" },
        404: {
          type: "object",
          properties: { message: { type: "string" } },
        },
      },
    },
  }, cancelReservationController);
}
