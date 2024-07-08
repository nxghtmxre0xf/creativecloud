-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Июл 08 2024 г., 19:05
-- Версия сервера: 5.6.20-log
-- Версия PHP: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `ccloud`
--

-- --------------------------------------------------------

--
-- Структура таблицы `properties`
--

CREATE TABLE IF NOT EXISTS `properties` (
`id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(45) DEFAULT NULL,
  `logo` varchar(20000) NOT NULL DEFAULT 'media/ccloud/512.png'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `properties`
--

INSERT INTO `properties` (`id`, `title`, `subtitle`, `logo`) VALUES
(1, 'CreativeCloud', 'by NXGHTMXRE', 'media/ccloud/512.png');

-- --------------------------------------------------------

--
-- Структура таблицы `threads`
--

CREATE TABLE IF NOT EXISTS `threads` (
`id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `attrs` text,
  `text` text,
  `status` varchar(255) DEFAULT NULL,
  `image` text NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `favorite` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `threads`
--
ALTER TABLE `threads`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `threads`
--
ALTER TABLE `threads`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
