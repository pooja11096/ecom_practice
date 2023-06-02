/*
  Warnings:

  - You are about to alter the column `product_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `product_price` VARCHAR(191) NOT NULL;
