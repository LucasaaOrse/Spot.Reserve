import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { userRoutes } from "./infra/http/routes/user-routes";
import fastifyJwt from "@fastify/jwt";
import { locationRoutes } from "./infra/http/routes/location-routes";
import { spaceRoutes } from "./infra/http/routes/space-routes";
import { eventRoutes } from "./infra/http/routes/event-routes";

const app = fastify();

// 1. Configuração do Swagger
app.register(fastifySwagger, {
  openapi: {
    info: { 
      title: "SpotReserve API", 
      description: "Sistema de agendamento de eventos e assentos",
      version: "1.0.0" 
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    servers: [{ url: "http://localhost:3333" }]
  },
});

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "mudar-depois",
});

app.register(fastifySwaggerUi, { 
  routePrefix: "/docs",
});

// 2. Registro das Rotas (Modular)
app.register(userRoutes);
app.register(locationRoutes)
app.register(spaceRoutes)
app.register(eventRoutes)

// 3. Inicialização
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("🚀 Server running on http://localhost:3333");
  console.log("📖 Documentation at http://localhost:3333/docs");
});