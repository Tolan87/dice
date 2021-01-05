-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Erstellungszeit: 05. Jan 2021 um 15:50
-- Server-Version: 10.4.13-MariaDB
-- PHP-Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `propania`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `players`
--

DROP TABLE IF EXISTS `players`;
CREATE TABLE IF NOT EXISTS `players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 1,
  `experience` int(11) DEFAULT NULL,
  `money` int(11) NOT NULL,
  `health` int(11) NOT NULL,
  `max_health` int(11) NOT NULL,
  `attack` int(11) NOT NULL,
  `weapon_id` int(11) NOT NULL,
  `armor_id` int(11) NOT NULL,
  `image` text NOT NULL,
  `role` varchar(255) NOT NULL,
  `locked` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `players`
--

INSERT INTO `players` (`id`, `account_id`, `level`, `experience`, `money`, `health`, `max_health`, `attack`, `weapon_id`, `armor_id`, `image`, `role`, `locked`) VALUES
(1, 1, 1, 0, 200, 3, 3, 1, 0, 0, './img/avatars/Default.png', 'Player', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tavern`
--

DROP TABLE IF EXISTS `tavern`;
CREATE TABLE IF NOT EXISTS `tavern` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) NOT NULL,
  `player_values` varchar(255) DEFAULT NULL,
  `tavern_values` varchar(255) DEFAULT NULL,
  `stake` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
