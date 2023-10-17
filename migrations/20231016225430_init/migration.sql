-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "userSecret" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "secret" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Build" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "headers" TEXT[],
    "values" INTEGER[],
    "projectId" TEXT NOT NULL,

    CONSTRAINT "TableModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "NetworkModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkModelLayer" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "neurons" INTEGER NOT NULL,
    "shape" INTEGER NOT NULL,
    "networkModelId" TEXT,

    CONSTRAINT "NetworkModelLayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_secret_key" ON "User"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "Build_id_key" ON "Build"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TableModel_id_key" ON "TableModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkModel_id_key" ON "NetworkModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkModelLayer_id_key" ON "NetworkModelLayer"("id");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userSecret_fkey" FOREIGN KEY ("userSecret") REFERENCES "User"("secret") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableModel" ADD CONSTRAINT "TableModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkModel" ADD CONSTRAINT "NetworkModel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkModelLayer" ADD CONSTRAINT "NetworkModelLayer_networkModelId_fkey" FOREIGN KEY ("networkModelId") REFERENCES "NetworkModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
