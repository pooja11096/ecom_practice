/*
  Warnings:

  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Variant` DROP FOREIGN KEY `Variant_productId_fkey`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `price` DOUBLE NOT NULL;

-- DropTable
DROP TABLE `Variant`;
