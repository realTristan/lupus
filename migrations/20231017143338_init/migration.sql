/*
  Warnings:

  - You are about to drop the column `name` on the `Build` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Build` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Build` table. All the data in the column will be lost.
  - Added the required column `networkName` to the `Build` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Build" DROP CONSTRAINT "Build_projectId_fkey";

-- DropForeignKey
ALTER TABLE "NetworkModel" DROP CONSTRAINT "NetworkModel_projectId_fkey";

-- DropForeignKey
ALTER TABLE "NetworkModelLayer" DROP CONSTRAINT "NetworkModelLayer_networkId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userSecret_fkey";

-- DropForeignKey
ALTER TABLE "TableModel" DROP CONSTRAINT "TableModel_projectId_fkey";

-- AlterTable
ALTER TABLE "Build" DROP COLUMN "name",
DROP COLUMN "projectId",
DROP COLUMN "updatedAt",
ADD COLUMN     "networkName" TEXT NOT NULL,
ADD COLUMN     "tableId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userSecret_fkey" FOREIGN KEY ("userSecret") REFERENCES "User"("secret") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableModel" ADD CONSTRAINT "TableModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkModel" ADD CONSTRAINT "NetworkModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkModelLayer" ADD CONSTRAINT "NetworkModelLayer_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "NetworkModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "TableModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
