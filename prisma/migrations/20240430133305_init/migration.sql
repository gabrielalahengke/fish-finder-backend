-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coordinate` (
    `id` VARCHAR(191) NOT NULL,
    `coordinat_owner` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Coordinate` ADD CONSTRAINT `Coordinate_coordinat_owner_fkey` FOREIGN KEY (`coordinat_owner`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
