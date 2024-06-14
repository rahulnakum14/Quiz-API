-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2024 at 11:28 AM
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
-- Database: `timetracking`
--

-- --------------------------------------------------------

--
-- Table structure for table `timetrackings`
--

CREATE TABLE `timetrackings` (
  `id` int(11) NOT NULL,
  `empId` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `timeIn` time DEFAULT NULL,
  `timeOut` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timetrackings`
--

INSERT INTO `timetrackings` (`id`, `empId`, `date`, `timeIn`, `timeOut`) VALUES
(1, 1, '2024-03-18', '15:39:47', '15:40:22'),
(2, 2, '2024-03-19', '15:39:53', '15:40:09'),
(3, 3, '2024-03-20', '15:39:56', '15:40:17'),
(4, 1, '2024-03-12', '15:40:49', '15:41:22'),
(5, 2, '2024-03-13', '15:41:01', '15:41:45'),
(6, 3, '2024-03-14', '15:41:04', '15:41:42'),
(7, 1, '2024-03-20', '15:43:14', '15:43:39'),
(8, 1, '2024-03-20', '15:44:17', '15:45:14'),
(9, 1, '2024-03-15', '15:51:40', '15:53:00'),
(10, 2, '2024-03-20', '15:51:42', '15:53:00'),
(11, 3, '2024-03-20', '15:51:45', '15:53:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `timetrackings`
--
ALTER TABLE `timetrackings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `empId` (`empId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `timetrackings`
--
ALTER TABLE `timetrackings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `timetrackings`
--
ALTER TABLE `timetrackings`
  ADD CONSTRAINT `timetrackings_ibfk_1` FOREIGN KEY (`empId`) REFERENCES `employees` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
