CREATE DATABASE my_database;

USE my_database;

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `reply` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) 

CREATE TABLE `investment` (
  `id` int(11) NOT NULL,
  `wallet_id` int(11) NOT NULL,
  `txn_hash` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `currency` varchar(50) NOT NULL,
  `token_transfered` varchar(50) DEFAULT NULL,
  `txn_status` varchar(50) NOT NULL,
  `is_token_minted` varchar(50) DEFAULT NULL,
  `mint_txn_hash` varchar(50) DEFAULT NULL,
  `transfer_wallet_addr` varchar(50) NOT NULL,
  `referral_code` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
)

INSERT INTO `investment` (`id`, `wallet_id`, `txn_hash`, `amount`, `currency`, `token_transfered`, `txn_status`, `is_token_minted`, `mint_txn_hash`, `transfer_wallet_addr`, `referral_code`, `created_at`, `updated_at`) VALUES
(1, 2, '0xababa111...', 12, 'usdc', NULL, 'pending', NULL, NULL, '0xabababa....', '1231', '2023-05-10 10:39:06', '2023-05-10 10:39:06'),
(2, 3, '0xababa111...', 12, 'usdc', NULL, 'pending', NULL, NULL, '0xabababa....', '1231', '2023-05-10 11:24:57', '2023-05-10 11:24:57'),
(5, 3, '0xababa111...', 12, 'usdc', NULL, 'pending', NULL, NULL, '0xabababa....', '1231', '2023-05-10 11:25:20', '2023-05-10 11:25:20');



CREATE TABLE `referral` (
  `id` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `referrer_id` int(11) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email_otp` varchar(10) DEFAULT NULL,
  `phone_otp` varchar(10) DEFAULT NULL,
  `is_email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_phone_verified` tinyint(1) NOT NULL DEFAULT 0,
  `phone` varchar(15) DEFAULT '0',
  `user_role` int(11) NOT NULL DEFAULT 5,
  `wp_viewed` tinyint(1) NOT NULL DEFAULT 0,
  `wp_downloaded` tinyint(1) NOT NULL DEFAULT 0,
  `invested` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
)

INSERT INTO `user` (`id`, `referrer_id`, `name`, `email`, `password`, `email_otp`, `phone_otp`, `is_email_verified`, `is_phone_verified`, `phone`, `user_role`, `wp_viewed`, `wp_downloaded`, `invested`, `created_at`, `updated_at`) VALUES
(5, NULL, 'testuser', 'test@gmail.com', 'pass12345', '577033', NULL, 1, 0, '94715463225', 5, 0, 0, 0, '2023-05-10 10:25:57', '2023-05-10 10:27:31'),
(6, NULL, 'testuser', 'nafees422@gmail.com', 'pass12345', '253482', NULL, 1, 0, '94715463225', 5, 0, 0, 0, '2023-05-10 10:26:08', '2023-05-10 10:37:42');

CREATE TABLE `wallet` (
  `id` int(11) NOT NULL,
  `wallet_address` varchar(50) NOT NULL,
  `wallet_name` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `wallet` (`id`, `wallet_address`, `wallet_name`, `user_id`, `created_at`, `updated_at`) VALUES
(1, '0xababa...', 'Main Account', 5, '2023-05-10 10:27:41', '2023-05-10 10:27:41'),
(2, '0xababa...', 'Main Account', 5, '2023-05-10 10:27:56', '2023-05-10 10:27:56'),
(3, '0xababa...', 'Main Account', 6, '2023-05-10 10:37:49', '2023-05-10 10:37:49');

ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `investment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wallet_id` (`wallet_id`);

ALTER TABLE `referral`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `referrer_id` (`referrer_id`);

ALTER TABLE `wallet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `investment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `referral`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `wallet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `investment`
  ADD CONSTRAINT `investment_ibfk_1` FOREIGN KEY (`wallet_id`) REFERENCES `wallet` (`id`);

ALTER TABLE `referral`
  ADD CONSTRAINT `referral_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`referrer_id`) REFERENCES `user` (`id`);

ALTER TABLE `wallet`
  ADD CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;