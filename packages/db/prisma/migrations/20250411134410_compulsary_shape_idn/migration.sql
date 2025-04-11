/*
  Warnings:

  - Made the column `shapeId` on table `NewChat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "NewChat" ALTER COLUMN "shapeId" SET NOT NULL;
