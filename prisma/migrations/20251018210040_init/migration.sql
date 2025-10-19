-- AlterTable
ALTER TABLE "Experiment" ALTER COLUMN "results" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ResponseResult" (
    "id" SERIAL NOT NULL,
    "experimentId" INTEGER NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "topP" DOUBLE PRECISION NOT NULL,
    "modelName" TEXT,
    "actualResponse" TEXT NOT NULL,
    "coherenceScore" DOUBLE PRECISION NOT NULL,
    "diversityScore" DOUBLE PRECISION NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResponseResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResponseResult_experimentId_temperature_topP_key" ON "ResponseResult"("experimentId", "temperature", "topP");

-- AddForeignKey
ALTER TABLE "ResponseResult" ADD CONSTRAINT "ResponseResult_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
