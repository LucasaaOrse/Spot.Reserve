/*
  Warnings:

  - You are about to drop the column `spaceId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `reserved_at` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the `Seat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Space` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Table` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventId,seatId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxSeatsPerTable` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTables` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_seatId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_tableId_fkey";

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_spaceId_fkey";

-- DropIndex
DROP INDEX "Reservation_seatId_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "spaceId",
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "maxSeatsPerTable" INTEGER NOT NULL,
ADD COLUMN     "maxTables" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "reserved_at";

-- DropTable
DROP TABLE "Seat";

-- DropTable
DROP TABLE "Space";

-- DropTable
DROP TABLE "Table";

-- CreateTable
CREATE TABLE "EventTable" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coord_x" INTEGER NOT NULL,
    "coord_y" INTEGER NOT NULL,

    CONSTRAINT "EventTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSeat" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "EventSeat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_eventId_seatId_key" ON "Reservation"("eventId", "seatId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTable" ADD CONSTRAINT "EventTable_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSeat" ADD CONSTRAINT "EventSeat_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "EventTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "EventSeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
