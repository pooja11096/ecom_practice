/*
  Warnings:

  - You are about to drop the column `price` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `total` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cart` DROP COLUMN `price`,
    ADD COLUMN `total` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `price`,
    ADD COLUMN `total` INTEGER NOT NULL;
