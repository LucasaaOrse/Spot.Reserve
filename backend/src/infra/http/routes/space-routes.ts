import type { FastifyInstance } from "fastify";
import { createSpaceController } from "../controllers/space/create-space-controller";
import { getByIdSpaceController } from "../controllers/space/getById-space-controller";
import { getByLocationIdSpaceController } from "../controllers/space/getByLocationIdSpace-controller";
import { getAllSpaceController } from "../controllers/space/getAll-space-controller";
import { updateSpaceController } from "../controllers/space/update-space-controller";

export async function spaceRoutes(app: FastifyInstance) {
  app.post("/space", {
    schema: {
      tags: ["Space"],
      summary: "Criar um novo espaço",
      body: {
        type: "object",
        required: ["name", "locationId", "totalArea"],
        properties: {
          name: { type: "string" },
          locationId: { type: "string" },
          totalArea: { type: "number" },
        },
      },
    },
  }, createSpaceController);

  app.get(
    "/spaces/:id",
    {
      schema: {
        summary: "Get space by id",
        tags: ["Space"],
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              space: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  locationId: { type: "string" },
                  totalArea: { type: ["number", "null"] },
                },
              },
            },
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    getByIdSpaceController
  );

  app.get(
    "/locations/:locationId/spaces",
    {
      schema: {
        summary: "Get spaces by location id",
        tags: ["Space"],
        params: {
          type: "object",
          required: ["locationId"],
          properties: {
            locationId: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              spaces: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    locationId: { type: "string" },
                    totalArea: { type: ["number", "null"] },
                  },
                },
              },
            },
          },
        },
      },
    },
    getByLocationIdSpaceController
  );
  
  app.get(
    "/spaces",
    {
      schema: {
        summary: "Get all spaces",
        tags: ["Space"],
        response: {
          200: {
            type: "object",
            properties: {
              spaces: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    locationId: { type: "string" },
                    totalArea: { type: ["number", "null"] },
                  },
                },
              },
            },
          },
        },
      },
    },
    getAllSpaceController
  );

  app.patch(
  "/spaces/:id",
  {
    schema: {
      summary: "Update space by id",
      tags: ["Space"],
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string", format: "uuid" },
        },
      },
      body: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 3 },
          locationId: { type: "string", format: "uuid" },
          totalArea: { type: "number", minimum: 0 },
        },
        additionalProperties: false,
      },
      response: {
        200: {
          type: "object",
          properties: {
            spaceId: { type: "string" },
          },
        },
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
  },
  updateSpaceController
);
}