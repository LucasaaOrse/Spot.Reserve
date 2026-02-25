import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateEventUseCase } from "../../../../main/factories/event/make-createEvent";

export async function createEventController(request: FastifyRequest, reply: FastifyReply) {
  // 1. Validar o Body (Removido o locationId, e usando coerce para a data)
  // No Controller
const bodySchema = z.object({
  title: z.string().min(5),
  // .nullable() permite null, .optional() permite undefined
  description: z.string().nullable().optional(), 
  date: z.coerce.date(),
  locationId: z.string().uuid(),
});
  // 2. Extrair o ID do Organizador do Token JWT
  // Assumindo que o seu middleware verifyJWT coloca os dados do token dentro de request.user.sub
  const organizerId = (request.user as any).sub; 

  try {
    const createEvent = makeCreateEventUseCase(); 

    // 3. Executar o Use Case passando os dados corretos
    const { title, description, date, locationId } = bodySchema.parse(request.body);

// Para garantir que o Use Case receba exatamente o que espera:
const { event } = await createEvent.execute({ 
  title, 
  description: description ?? null, // Se for undefined, vira null
  date, 
  organizerId, 
  locationId
});

    return reply.status(201).send({ eventId: event.id });
  } catch (err) {
    // 4. Tratamento de Erro melhorado para devolver a mensagem real da Entidade/Use Case
    if (err instanceof Error) {
      return reply.status(400).send({ message: err.message });
    }
    return reply.status(500).send({ message: "Erro interno ao criar evento." });
  }
}