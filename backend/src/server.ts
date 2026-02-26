import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import { userRoutes } from "./infra/http/routes/user-routes";
import { locationRoutes } from "./infra/http/routes/location-routes";
import { eventRoutes } from "./infra/http/routes/event-routes";
import { invitationRoutes } from "./infra/http/routes/invitation-routes";
import { setupErrorHandler } from "./infra/http/errors/error-handler";

const app = fastify({ logger: true });

// ── CORS ──────────────────────────────────────────────────────────────────────
app.addHook("onRequest", async (request, reply) => {
  reply.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL ?? "*");
  reply.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    return reply.code(204).send();
  }
});

// ── ERROR HANDLER ─────────────────────────────────────────────────────────────
setupErrorHandler(app);

// ── JWT ───────────────────────────────────────────────────────────────────────
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET ?? "change-this-secret-in-production",
});

// ── SWAGGER ───────────────────────────────────────────────────────────────────
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "SpotReserve API",
      description: "Sistema de agendamento de eventos e reserva de assentos",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [{ url: "http://localhost:3333" }],
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

// ── ROTAS ─────────────────────────────────────────────────────────────────────
app.register(userRoutes);
app.register(locationRoutes);
app.register(eventRoutes);
app.register(invitationRoutes);

// ── START ─────────────────────────────────────────────────────────────────────
app.listen({ port: Number(process.env.PORT ?? 3333), host: "0.0.0.0" }).then(() => {
  console.log("🚀 Server running on http://localhost:3333");
  console.log("📖 Documentation at http://localhost:3333/docs");
});
