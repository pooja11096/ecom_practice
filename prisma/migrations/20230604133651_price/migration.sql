/*
  Warnings:

  - You are about to drop the column `total` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `price` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cart` DROP COLUMN `total`,
    ADD COLUMN `price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `price` INTEGER NOT NULL;
