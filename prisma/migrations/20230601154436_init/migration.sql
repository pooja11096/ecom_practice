/*
  Warnings:

  - Made the column `image_url` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `image_url` VARCHAR(191) NOT NULL;
