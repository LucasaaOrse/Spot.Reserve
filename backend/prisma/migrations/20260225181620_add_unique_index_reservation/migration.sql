/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reservation_eventId_seatId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_eventId_userId_key" ON "Reservation"("eventId", "userId");
