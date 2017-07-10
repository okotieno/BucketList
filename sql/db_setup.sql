-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 10, 2017 at 04:20 AM
-- Server version: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bucketlist`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_createUser` (IN `p_name` VARCHAR(300), IN `p_username` VARCHAR(300), IN `p_password` VARCHAR(300))  BEGIN
    if ( select exists (select 1 from tbl_user where user_username = p_username) ) THEN
     
        select 'Username Exists !!';
     
    ELSE
     
        insert into tbl_user
        (
            user_name,
            user_username,
            user_password
        )
        values
        (
            p_name,
            p_username,
            p_password
        );
     
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_loginUser` (IN `p_username` VARCHAR(300), IN `p_password` VARCHAR(300))  BEGIN
    if ( select exists (select user_username from tbl_user where user_username = p_username AND user_password = p_password) ) THEN
     
        select user_id, user_username from tbl_user where user_username = p_username;
     
    ELSE
     
        select 'Invalid username or password !';
     
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `user_id` bigint(20) NOT NULL,
  `user_name` varchar(45) DEFAULT NULL,
  `user_username` varchar(45) DEFAULT NULL,
  `user_password` varchar(300) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`user_id`, `user_name`, `user_username`, `user_password`) VALUES
(1, 'Owen', 'okotieno@yahoo.com', 'pbkdf2:sha256:50000$W3BjyPPL$c103263121c24d1e9c4f5311d5d5a66b02579e3f8c762c18259f3bf8e344fdf9'),
(2, 'OWEN', 'admin@admin.com', 'pbkdf2:sha256:50000$LO1cXvQC$0a4c891dfafbd21136a78e6ef3729109d4bf8ed9e7ad0d1ff5e8263403eedacb'),
(3, 'OWEN', 'okonyots@yahoo.com', 'pbkdf2:sha256:50000$vwuo8Hmh$0983551a5b93f8e32fea86fe477905b0b09ffd56d0e6fce7c03dc564efc25eac'),
(4, 'oko', 'okotieno', '5f4dcc3b5aa765d61d8327deb882cf99');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
