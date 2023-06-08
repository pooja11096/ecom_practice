/*
  Warnings:

  - You are about to alter the column `product_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `product_price` INTEGER NOT NULL;
