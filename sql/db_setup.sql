-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2017 at 02:51 PM
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Add_Bl_Activity` (IN `p_activity_name` VARCHAR(300), IN `p_activity_category_id` INT)  BEGIN

	if (select exists(select 1 from bl_activity where activity_category_id = p_activity_category_id and activity_name = p_activity_name ))
		then 
			select 'Activity Exists';
	else
		insert into bl_activity
        (
			activity_id, 
            activity_name, 
            activity_category_id
		) 
        values 
        (
			null,
            p_activity_name, 
            p_activity_category_id
        );

   end if;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Add_Bl_Category` (IN `p_category_name` VARCHAR(300), IN `p_category_user_id` INT)  BEGIN

	if (select exists(select 1 from bl_category where category_user_id = p_category_user_id))
		then 
        if (select exists (select 1 from bl_category where category_user_id = p_category_user_id and category_name = p_category_name))
			then select 'Category Exists!!';
		else
			insert into bl_category
			(
				category_id, 
				category_name, 
				category_user_id
			) 
			values 
			(
				null,
				p_category_name,
				p_category_user_id
			);
		end if;
	else
		insert into bl_category
        (
			category_id, 
            category_name, 
            category_user_id
		) 
        values 
        (
			null,
            p_category_name,
            p_category_user_id
        );

   end if;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_all_bl_activity` (IN `p_activity_category_id` INT)  BEGIN
    IF ( 
        select exists (
        	select 1 from bl_activity where activity_category_id = p_activity_category_id 
        ) 
    ) 
    THEN 
		select * from bl_activity where activity_category_id = p_activity_category_id;
     
    ELSE
		select 'Nothing Found !!';
     
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_all_bl_category` (IN `p_category_user_id` INT)  BEGIN
    IF ( 
        select exists (
        	select 1 from bl_category where category_user_id = p_category_user_id 
        ) 
    ) 
    THEN 
		select * from bl_category where category_user_id = p_category_user_id;
     
    ELSE
		select 'Nothing Found !!';
     
    END IF;
END$$

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_Bl_activity` (IN `p_activity_id` INT)  BEGIN

	delete from bl_activity where activity_id = p_activity_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_Category` (IN `p_category_id` INT)  BEGIN

	delete from bl_category where category_id = p_category_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_loginUser` (IN `p_username` VARCHAR(300), IN `p_password` VARCHAR(300))  BEGIN
    if ( select exists (select user_username from tbl_user where user_username = p_username AND user_password = p_password) ) THEN
     
        select user_id, user_username from tbl_user where user_username = p_username;
     
    ELSE
     
        select 'Invalid username or password !';
     
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_activity` (IN `p_activity_id` INT, IN `p_activity_name` VARCHAR(300), IN `p_activity_date` VARCHAR(300), IN `p_activity_category_id` INT)  BEGIN
    IF ( select exists (
		select 1 from bl_activity 
			where 
				activity_id = p_activity_id and 
                activity_name = p_activity_name and 
                activity_date = p_activity_date
			) 
		) 
	THEN
        select 'Nothing to update !!';
	ELSEIF(
		select exists (
			select 1 from bl_activity 
				where activity_name = p_activity_name and 
                activity_category_id = p_activity_category_id and
                activity_id <> p_activity_id
        )
    
    )
    THEN
		select 'Activity With this Name Exists';
     
    ELSE
     
        UPDATE bl_activity 
			SET activity_name = p_activity_name, 
				activity_date = p_activity_date 
			WHERE activity_id = p_activity_id; 
     
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_category` (IN `p_category_id` INT, IN `p_category_name` VARCHAR(300), IN `p_category_user_id` INT)  BEGIN
    IF ( select exists (
		select 1 from bl_category
			where 
				category_id = p_category_id and 
                category_name = p_category_name and 
                category_user_id = p_category_user_id
			) 
		) 
	THEN
        select 'Nothing to update !!';
	ELSEIF(
		select exists (
			select 1 from bl_category
				where category_name = p_category_name and 
                category_user_id = p_category_user_id and
                category_id <> p_category_id
        )
    
    )
    THEN
		select 'Activity With this Name Exists';
     
    ELSE
     
        UPDATE bl_category
			SET category_name = p_category_name 
			WHERE category_id = p_category_id; 
     
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_id` (IN `p_username` VARCHAR(300))  BEGIN
    if ( select exists (select 1 from tbl_user where user_username = p_username) ) THEN
     
        select user_id from tbl_user where user_username = p_username;
     
    ELSE
     
        select 'Invalid username !';
     
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `bl_activity`
--

CREATE TABLE `bl_activity` (
  `activity_id` int(11) NOT NULL,
  `activity_name` varchar(300) NOT NULL,
  `activity_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activity_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activity_category_id` int(11) NOT NULL,
  `activity_starred` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bl_activity`
--

INSERT INTO `bl_activity` (`activity_id`, `activity_name`, `activity_created_at`, `activity_date`, `activity_category_id`, `activity_starred`) VALUES
(1, 'Swimming', '2017-08-04 23:36:18', '2017-08-04 23:36:18', 1, 0),
(17, 'Chess', '2017-08-06 08:42:09', '2017-08-06 08:42:09', 16, 0);

-- --------------------------------------------------------

--
-- Table structure for table `bl_category`
--

CREATE TABLE `bl_category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(300) NOT NULL,
  `category_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bl_category`
--

INSERT INTO `bl_category` (`category_id`, `category_name`, `category_user_id`) VALUES
(6, 'Adventure', 4),
(7, 'Sports', 1),
(8, 'Adventure2', 1),
(9, 'New Category', 1),
(10, 'New Category 2', 1),
(11, '1', 1),
(12, 'eereefdsfds', 1),
(13, '1', 5),
(14, 'Sports', 5),
(15, 'grand', 5),
(16, 'Adventure', 5),
(19, '11', 5),
(20, 'Adventure2', 5),
(21, 'dfdsf', 5),
(22, 'hgfhgfhdg', 5),
(48, 'sdhsjkfdsa', 5),
(49, 'Adventure2', 4),
(50, 'Chess', 4),
(52, 'Sports', 6),
(53, 'New', 2),
(54, 'New', 7),
(55, 'Adventure', 7),
(56, 'Adventure2', 7),
(57, 'Chess', 7),
(58, '11', 7),
(59, 'GG', 7),
(66, 'Adventure', 8),
(72, '11111111111', 5),
(77, 'newName', 42),
(78, 'newName', 43),
(79, 'Adventure', 50),
(80, 'Adventure2', 50),
(81, 'Chess', 50),
(82, '11111111111', 50),
(83, 'Adventure', 51),
(84, 'Sports', 51),
(85, 'Adventure', 52),
(86, 'Sports', 52),
(87, 'Adventure', 53),
(88, 'Adventure2', 53),
(89, 'Chess', 53),
(94, 'Adventures', 11),
(95, 'Adventure', 11);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `user_id` bigint(20) NOT NULL,
  `user_name` varchar(45) DEFAULT NULL,
  `user_username` varchar(45) DEFAULT NULL,
  `user_password` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`user_id`, `user_name`, `user_username`, `user_password`) VALUES
(1, 'Owen', 'okotieno@yahoo.com', 'pbkdf2:sha256:50000$W3BjyPPL$c103263121c24d1e9c4f5311d5d5a66b02579e3f8c762c18259f3bf8e344fdf9'),
(2, 'OWEN', 'admin@admin.com', 'pbkdf2:sha256:50000$LO1cXvQC$0a4c891dfafbd21136a78e6ef3729109d4bf8ed9e7ad0d1ff5e8263403eedacb'),
(3, 'OWEN', 'okonyots@yahoo.com', 'pbkdf2:sha256:50000$vwuo8Hmh$0983551a5b93f8e32fea86fe477905b0b09ffd56d0e6fce7c03dc564efc25eac'),
(4, 'oko', 'okotieno', '5f4dcc3b5aa765d61d8327deb882cf99'),
(5, '1', '1', 'c4ca4238a0b923820dcc509a6f75849b'),
(6, '2', '2', 'c81e728d9d4c2f636f067f89cc14862c'),
(7, '3', '3', 'eccbc87e4b5ce2fe28308fd9f2a7baf3'),
(8, '6', '6', '1679091c5a880faf6fb5e6087eb1b2dc'),
(9, '7', '7', '8f14e45fceea167a5a36dedd4bea2543'),
(10, '9', '9', '45c48cce2e2d7fbdea1afc51c7c6ad26'),
(11, 'newuser', 'newuser', '5f4dcc3b5aa765d61d8327deb882cf99'),
(12, 'me', 'me', '5f4dcc3b5aa765d61d8327deb882cf99'),
(13, 'newuser', 'ee', '08a4415e9d594ff960030b921d42b91e'),
(14, 'owen1', 'owen1', '5f4dcc3b5aa765d61d8327deb882cf99'),
(15, 'grand', 'grand', '86a65acd94b33daa87c1c6a2d1408593'),
(16, 'owen', 'owen2', '5f4dcc3b5aa765d61d8327deb882cf99'),
(17, 'o123456', 'o123456', '5f4dcc3b5aa765d61d8327deb882cf99'),
(18, 'a12346', 'a12346', '5f4dcc3b5aa765d61d8327deb882cf99'),
(19, 'bad', 'bad', 'bae60998ffe4923b131e3d6e4c19993e'),
(20, 'owen', 'password', '5f4dcc3b5aa765d61d8327deb882cf99'),
(25, 'user_id', 'user_id', '5f4dcc3b5aa765d61d8327deb882cf99'),
(36, 'sdfgh', 'dfghj', 'a460be6a7e38cc2f79598f4b1e9f894f'),
(37, 'dfdgh', 'sdfghjk', 'ae4fe81fed07eda5ef18e48ccc9ca0ad'),
(38, 'wertyu', 'ertyu8', 'f89abebdc4c842c22c34606f5aced062'),
(39, 'dfghv', 'jvgfg', '5523c88dd347d1b7cc617f632b7efdb7'),
(40, 'hgfftr', 'yyyy', '73c18c59a39b18382081ec00bb456d43'),
(41, 'yyy', 'hh', '5e36941b3d856737e81516acd45edc50'),
(42, 'uuu', 'uuu', '827ccb0eea8a706c4c34a16891f84e7b'),
(43, 'qwerthdxc', 'sdfghjtretuy', '0e3442d022f04f39dc2456eafe27ada2'),
(44, 'rrtyuil', 'trdytfuygnm', '79d19886dbf82ec6be09aaad3889ed76'),
(45, 'erty', 'ewsrxc', '025c1e37b069dcd4129f02c842b705af'),
(46, 'fyui', 'hjbjk', '3e8bbd9caf510ed9a4f047bbed72d853'),
(47, 'mm', 'knm,', '0cfebe6f93fc05da3ce408c8f211b4b9'),
(48, 'hjk', 'kmmm', 'dd65e542a67731cca6b8c92a1b01eba4'),
(49, 'hvhkbl', 'ghjhkbn', 'caf0376805351bab1cb5ecc7789c124a'),
(50, '. mlk', 'rtregtre', 'e3fd2afa75b6e2e40021c7054361fbf4'),
(51, 'we', 'we', '5f4dcc3b5aa765d61d8327deb882cf99'),
(52, 'best BucketList App', 'bestbucketlist', '5f4dcc3b5aa765d61d8327deb882cf99'),
(53, 'user Owen', 'userowen@yahoo.com', '5f4dcc3b5aa765d61d8327deb882cf99');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bl_activity`
--
ALTER TABLE `bl_activity`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `activity_category_id` (`activity_category_id`),
  ADD KEY `activity_category_id_2` (`activity_category_id`);

--
-- Indexes for table `bl_category`
--
ALTER TABLE `bl_category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bl_activity`
--
ALTER TABLE `bl_activity`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `bl_category`
--
ALTER TABLE `bl_category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;
--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
