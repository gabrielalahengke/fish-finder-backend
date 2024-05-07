/*
  Warnings:

  - Added the required column `coordinate_point` to the `Coordinate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coordinate` ADD COLUMN `coordinate_point` DECIMAL(65, 30) NOT NULL;
