/*
  Warnings:

  - You are about to drop the column `campaignId` on the `CommunicationLog` table. All the data in the column will be lost.
  - You are about to drop the `Campaign` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `segmentId` to the `CommunicationLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Segment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Campaign` DROP FOREIGN KEY `Campaign_segmentId_fkey`;

-- DropForeignKey
ALTER TABLE `CommunicationLog` DROP FOREIGN KEY `CommunicationLog_campaignId_fkey`;

-- DropIndex
DROP INDEX `CommunicationLog_campaignId_fkey` ON `CommunicationLog`;

-- AlterTable
ALTER TABLE `CommunicationLog` DROP COLUMN `campaignId`,
    ADD COLUMN `segmentId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Segment` ADD COLUMN `message` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Campaign`;

-- AddForeignKey
ALTER TABLE `CommunicationLog` ADD CONSTRAINT `CommunicationLog_segmentId_fkey` FOREIGN KEY (`segmentId`) REFERENCES `Segment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
