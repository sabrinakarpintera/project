-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2026 at 03:19 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fuku`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `size`, `color`, `quantity`, `created_at`) VALUES
(80, 15, 34, 'Small', 'Yellow', 1, '2026-04-23 21:24:42'),
(86, 16, 32, 'Small', 'Brown', 2, '2026-04-23 22:40:58'),
(87, 16, 31, 'Small', 'Brown', 2, '2026-04-23 22:47:14'),
(88, 16, 31, 'Small', 'Black', 1, '2026-04-23 22:47:44'),
(89, 17, 31, 'Small', 'Brown', 1, '2026-04-24 10:23:48');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `description`, `quantity`, `image`) VALUES
(30, 'Plaid Print Long-sleeved', 849.00, 'This item is a brown plaid print satin patchwork off-shoulder cropped top with a zippered front and fitted waist corset detail.', 100, 'uploads/product1.png'),
(31, 'Off Shoulder Lace', 499.00, 'This item is a French Off Shoulder Lace-Trimmed top.', 100, 'uploads/Comment for links 💌.jpg'),
(32, 'Ruched Faux Leather ', 699.00, 'Vintage Elegant Faux PU Coated Ruched Adjustable Strap Women Cami Top.', 100, 'uploads/download (1).jpg'),
(33, 'Pleated Mini Skirt', 1499.00, 'This item is a brown faux leather pleated mini skirt featuring lace-up detailing and stud accents.\r\n', 100, 'uploads/download (2).jpg'),
(34, 'Cropped Vest Top', 999.00, 'This item is a yellow cropped side pocket military-style vest top.', 100, 'uploads/yellow cropped side pocket top.jpg'),
(35, 'Halter Neck Tube', 399.00, 'The product is a Plaid Print Pleated Halter Neck Camisole.', 100, 'uploads/download (4).jpg'),
(36, 'Plaid Asymmetric Skirt', 599.00, 'A midi-length garment featuring a checked pattern and ruffled trim. ', 100, 'uploads/download (5).jpg'),
(37, 'Halter Tank Top', 299.00, 'Solid Color Front-Tie Casual Halter Tank Top. ', 100, 'uploads/Apricot top.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `product_colors`
--

CREATE TABLE `product_colors` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_colors`
--

INSERT INTO `product_colors` (`id`, `product_id`, `color`) VALUES
(40, 30, 'Brown'),
(41, 31, 'Brown'),
(42, 31, 'Black'),
(43, 32, 'Brown'),
(44, 33, 'Brown'),
(45, 33, 'Black'),
(46, 33, 'Red'),
(47, 34, 'Yellow'),
(48, 34, 'Black'),
(49, 34, 'Red'),
(50, 35, 'Red'),
(51, 35, 'Orange'),
(52, 36, 'Brown'),
(53, 36, 'Orange'),
(54, 37, 'Brown'),
(55, 37, 'Red');

-- --------------------------------------------------------

--
-- Table structure for table `product_sizes`
--

CREATE TABLE `product_sizes` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_sizes`
--

INSERT INTO `product_sizes` (`id`, `product_id`, `size`) VALUES
(41, 30, 'Small'),
(42, 30, 'Medium'),
(43, 30, 'Large'),
(44, 31, 'Small'),
(45, 31, 'Medium'),
(46, 32, 'Small'),
(47, 33, 'Small'),
(48, 33, 'Medium'),
(49, 34, 'Small'),
(50, 35, 'Small'),
(51, 35, 'Medium'),
(52, 36, 'Small'),
(53, 37, 'Medium'),
(54, 37, 'Large');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(20) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `created_at`, `role`) VALUES
(1, 'Blessy', 'admin', '$2y$10$rIo1xbCqn2LM26voaVyYienAfYxWpqGCLhCq0MdVYt6zv1nGVEgVC', '2026-04-24 10:34:10', 'admin'),
(15, 'mina', 'mina', '$2y$10$He7T5gZm./nbye2tx/9hpe/1wizdqzY5mqALqfAWvo2SroXBusq0O', '2026-04-23 12:58:09', 'user'),
(16, 'sana', 'momo', '$2y$10$3X8qKPke.4gT6lKbYDJkQuwFB2gOY9yFSOBDp16H..yGSJKpvBZ26', '2026-04-23 15:23:08', 'user'),
(17, 'Im Nayeon', 'Nayeon', '$2y$10$VdljqXUmtcSJUMzSuSDBQOSniq5UqnYf9O9RDMQAYekRshdN4eEBe', '2026-04-24 09:56:32', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `street` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`id`, `user_id`, `email`, `phone`, `region`, `province`, `city`, `barangay`, `street`, `created_at`) VALUES
(1, 1, 'csbln10@gmail.com', '09605440559', 'Eastern Visayas', 'Northern Samar', 'Rosario', 'Bantolinao', '123', '2026-03-12 14:55:48'),
(6, 16, 'csbln10@gmail.com', '09605440559', 'CAR', 'Ifugao', 'Tinoc', 'Tukucan', '123', '2026-04-24 07:10:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_colors`
--
ALTER TABLE `product_colors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `product_colors`
--
ALTER TABLE `product_colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `product_colors`
--
ALTER TABLE `product_colors`
  ADD CONSTRAINT `product_colors_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
