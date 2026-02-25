import type { FastifyInstance } from "fastify";
import { createLocationController } from "../controllers/location/create-location-controller";
import { listLocationsController } from "../controllers/location/getAll-location-controller";
import { getByIdLocationController } from "../controllers/location/getById-location-controller";
import { updateLocationController } from "../controllers/location/update-location-controller";

export async function locationRoutes(app: FastifyInstance) {
  app.post(
    "/locations",
    {
      schema: {
        tags: ["Locations"],
        summary: "Create a new location",
        body: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 3 },
            address: { type: "string", minLength: 5 },
            maxTables: { type: "integer", minimum: 1 },
            maxSeatsPerTable: { type: "integer", minimum: 1 },
          },
          required: ["name", "address", "maxTables", "maxSeatsPerTable"],
        },
        response: {
          201: {
            description: "Location created",
            content: {
              "application/json": {
                schema: {
                type: "object",
                  properties: { locationId: { type: "string" } },
                },
              },
            },
          },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                type: "object",
                properties: {
                  message: { type: "string" }
                }
              },
              },
            },
          },
        },
      },
    },
    createLocationController
  );

  app.get(
    "/locations",
    {
      schema: {
        tags: ["Locations"],
        summary: "List all locations",
        response: {
          200: {
            description: "Locations list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    locations: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          address: { type: "string" },
                          maxTables: { type: "integer" },
                          maxSeatsPerTable: { type: "integer" },
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
  }, listLocationsController);

  app.get(
    "/locations/:id",
    {
      schema: {
        tags: ["Locations"],
        summary: "Get a location by id",
        response: {
          200: {
            description: "Location found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    location: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        address: { type: "string" },
                        maxTables: { type: "integer" },
                        maxSeatsPerTable: { type: "integer" },
                      },
                  },
                },
              },
            },
          },
        },
        400: {
            description: "Location not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
              },
            },
          },
        },
      },
    },
  }, getByIdLocationController);

  app.put(
    "/locations/:id",
    {
      schema: {
        tags: ["Locations"],
        summary: "Update a location by id",
        body: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 3 },
            address: { type: "string", minLength: 5 },
            maxTables: { type: "integer", minimum: 1 },
            maxSeatsPerTable: { type: "integer", minimum: 1 },
        },
        minProperties: 1,
        response: {
          200: {
            description: "Location updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    locationId: { type: "string" },
                  },
                },
              
              },
            },
          },
        },
        400: {
            description: "Location not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
              },
            },
          },
        },
      },
    },
  }, updateLocationController );
}