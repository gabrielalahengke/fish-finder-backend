/*
  Warnings:

  - You are about to drop the column `coordinate_point` on the `coordinate` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Coordinate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Coordinate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coordinate` DROP COLUMN `coordinate_point`,
    ADD COLUMN `latitude` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `longitude` DECIMAL(65, 30) NOT NULL;
