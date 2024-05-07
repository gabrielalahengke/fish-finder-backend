-- DropForeignKey
ALTER TABLE `coordinate` DROP FOREIGN KEY `Coordinate_coordinat_owner_fkey`;

-- AddForeignKey
ALTER TABLE `coordinate` ADD CONSTRAINT `coordinate_coordinat_owner_fkey` FOREIGN KEY (`coordinat_owner`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `authentications` RENAME INDEX `Authentications_token_key` TO `authentications_token_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_username_key` TO `user_username_key`;
