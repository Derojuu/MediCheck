-- AlterTable
ALTER TABLE "public"."medication_batches" ADD COLUMN     "registryTopicId" TEXT;

-- AlterTable
ALTER TABLE "public"."medication_units" ADD COLUMN     "currentOwner" TEXT NOT NULL DEFAULT 'system',
ADD COLUMN     "registrySeq" INTEGER,
ADD COLUMN     "registryTopicId" TEXT;
