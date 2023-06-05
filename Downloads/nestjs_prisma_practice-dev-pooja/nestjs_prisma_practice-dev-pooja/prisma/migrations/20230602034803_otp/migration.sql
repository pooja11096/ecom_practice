/*
  Warnings:

  - Made the column `image_url` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `image_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `otp` INTEGER NOT NULL DEFAULT 0;
