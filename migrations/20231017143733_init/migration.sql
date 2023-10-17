/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Build` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `NetworkModel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `NetworkModelLayer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `TableModel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Build_id_key" ON "Build"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkModel_id_key" ON "NetworkModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkModelLayer_id_key" ON "NetworkModelLayer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TableModel_id_key" ON "TableModel"("id");
