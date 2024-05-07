-- CreateTable
CREATE TABLE `Authentications` (
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Authentications_token_key`(`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
