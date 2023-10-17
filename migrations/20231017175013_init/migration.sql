/*
  Warnings:

  - You are about to drop the `Build` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Build" DROP CONSTRAINT "Build_tableId_fkey";

-- DropTable
DROP TABLE "Build";

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "networkName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "model" TEXT NOT NULL,
    "tableId" TEXT,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Model_id_key" ON "Model"("id");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "TableModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
