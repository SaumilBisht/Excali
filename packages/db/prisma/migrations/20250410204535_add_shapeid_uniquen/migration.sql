/*
  Warnings:

  - A unique constraint covering the columns `[shapeId]` on the table `NewChat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NewChat_shapeId_key" ON "NewChat"("shapeId");
