/*
  Warnings:

  - You are about to drop the column `registrySeq` on the `medication_units` table. All the data in the column will be lost.
  - You are about to drop the column `registryTopicId` on the `medication_units` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."medication_units" DROP COLUMN "registrySeq",
DROP COLUMN "registryTopicId",
ADD COLUMN     "registrySequence" INTEGER;
