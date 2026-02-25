/*
  Warnings:

  - A unique constraint covering the columns `[eventId,seatId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reservation_eventId_seatId_key" ON "Reservation"("eventId", "seatId");
