import type { EventLayout, EventWithDetails, Location } from "./types"

export const mockLocations: Location[] = [
  {
    id: "loc-1",
    name: "Salão Principal",
    address: "Rua das Flores, 210 - Centro",
    maxTables: 20,
    maxSeatsPerTable: 8,
  },
  {
    id: "loc-2",
    name: "Terraço Spot",
    address: "Av. Atlântica, 1020 - Cobertura",
    maxTables: 12,
    maxSeatsPerTable: 6,
  },
]

export const mockEvents: EventWithDetails[] = [
  {
    id: "evt-1",
    title: "Jantar de Networking",
    description: "Conexão entre convidados e parceiros estratégicos.",
    date: new Date().toISOString(),
    organizerId: "org-1",
    locationId: "loc-1",
    locationName: "Salão Principal",
    locationAddress: "Rua das Flores, 210 - Centro",
    maxTables: 20,
    maxSeatsPerTable: 8,
    tablesCount: 3,
    invitationsCount: 12,
    reservationsCount: 7,
  },
  {
    id: "evt-2",
    title: "Lançamento de Produto",
    description: "Apresentação exclusiva para convidados VIP.",
    date: new Date(Date.now() + 86400000).toISOString(),
    organizerId: "org-1",
    locationId: "loc-2",
    locationName: "Terraço Spot",
    locationAddress: "Av. Atlântica, 1020 - Cobertura",
    maxTables: 12,
    maxSeatsPerTable: 6,
    tablesCount: 0,
    invitationsCount: 5,
    reservationsCount: 0,
  },
]

export const mockLayout: EventLayout = {
  event: {
    id: "evt-1",
    title: "Jantar de Networking",
    date: new Date().toISOString(),
    myReservationSeatId: null,
    location: {
      name: "Salão Principal",
      address: "Rua das Flores, 210 - Centro",
    },
    tables: [
      {
        id: "table-1",
        name: "Mesa A",
        x: 90,
        y: 90,
        isFull: false,
        seats: [
          { id: "s1", label: "A1", isOccupied: true, isMine: false },
          { id: "s2", label: "A2", isOccupied: false, isMine: false },
          { id: "s3", label: "A3", isOccupied: false, isMine: false },
          { id: "s4", label: "A4", isOccupied: true, isMine: false },
        ],
      },
      {
        id: "table-2",
        name: "Mesa B",
        x: 270,
        y: 180,
        isFull: false,
        seats: [
          { id: "s5", label: "B1", isOccupied: false, isMine: false },
          { id: "s6", label: "B2", isOccupied: true, isMine: false },
          { id: "s7", label: "B3", isOccupied: false, isMine: false },
          { id: "s8", label: "B4", isOccupied: false, isMine: false },
        ],
      },
      {
        id: "table-3",
        name: "Mesa C",
        x: 460,
        y: 120,
        isFull: true,
        seats: [
          { id: "s9", label: "C1", isOccupied: true, isMine: false },
          { id: "s10", label: "C2", isOccupied: true, isMine: false },
          { id: "s11", label: "C3", isOccupied: true, isMine: false },
          { id: "s12", label: "C4", isOccupied: true, isMine: false },
        ],
      },
    ],
  },
}
