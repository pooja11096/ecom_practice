/*
  Warnings:

  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `category_name` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` DROP COLUMN `name`,
    ADD COLUMN `category_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `description`,
    DROP COLUMN `name`,
    DROP COLUMN `price`,
    ADD COLUMN `product_description` VARCHAR(191) NOT NULL,
    ADD COLUMN `product_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `product_price` DOUBLE NOT NULL;
