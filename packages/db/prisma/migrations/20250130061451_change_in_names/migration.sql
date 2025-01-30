/*
  Warnings:

  - You are about to drop the column `data` on the `Shape` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Shape` table. All the data in the column will be lost.
  - Added the required column `shapeData` to the `Shape` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shapeType` to the `Shape` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shape" DROP COLUMN "data",
DROP COLUMN "type",
ADD COLUMN     "shapeData" JSONB NOT NULL,
ADD COLUMN     "shapeType" TEXT NOT NULL;
