-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: thrive_db
-- ------------------------------------------------------
-- Server version	5.7.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `assessment_done` tinyint(1) NOT NULL,
  `assessment_done_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `ix_users_email` (`email`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test User 2','TestUser2','test@test.com','$2b$12$7dLHNCz6SE9G4xtffE0VYenXG.DSbMep3XcmWk1arks1APwe3cQke',0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_clinical_measurement`
--

DROP TABLE IF EXISTS `users_clinical_measurement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_clinical_measurement` (
  `id` int(11) NOT NULL,
  `height` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `bmi` float DEFAULT NULL,
  `systolic_bp` int(11) DEFAULT NULL,
  `diastolic_bp` int(11) DEFAULT NULL,
  `glucose_level` int(11) DEFAULT NULL,
  `cholesterol_total` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `users_clinical_measurement_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_clinical_measurement`
--

LOCK TABLES `users_clinical_measurement` WRITE;
/*!40000 ALTER TABLE `users_clinical_measurement` DISABLE KEYS */;
INSERT INTO `users_clinical_measurement` VALUES (1,170.5,70.2,NULL,100,60,1,100);
/*!40000 ALTER TABLE `users_clinical_measurement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_general_data`
--

DROP TABLE IF EXISTS `users_general_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_general_data` (
  `id` int(11) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `gender` varchar(40) DEFAULT NULL,
  `education` varchar(40) DEFAULT NULL,
  `healthcare` int(11) DEFAULT NULL,
  `income` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `users_general_data_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_general_data`
--

LOCK TABLES `users_general_data` WRITE;
/*!40000 ALTER TABLE `users_general_data` DISABLE KEYS */;
INSERT INTO `users_general_data` VALUES (1,30,NULL,'1','1',0,1);
/*!40000 ALTER TABLE `users_general_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_health_score`
--

DROP TABLE IF EXISTS `users_health_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_health_score` (
  `id` int(11) NOT NULL,
  `generalHealth` int(11) DEFAULT NULL,
  `mentalHealth` int(11) DEFAULT NULL,
  `physicalHealth` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `users_health_score_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_health_score`
--

LOCK TABLES `users_health_score` WRITE;
/*!40000 ALTER TABLE `users_health_score` DISABLE KEYS */;
INSERT INTO `users_health_score` VALUES (1,5,5,5);
/*!40000 ALTER TABLE `users_health_score` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_lifestyle_information`
--

DROP TABLE IF EXISTS `users_lifestyle_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_lifestyle_information` (
  `id` int(11) NOT NULL,
  `smoking` int(11) DEFAULT NULL,
  `alcohol` int(11) DEFAULT NULL,
  `active_lifestyle` int(11) DEFAULT NULL,
  `vegetables` int(11) DEFAULT NULL,
  `fruits` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `users_lifestyle_information_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_lifestyle_information`
--

LOCK TABLES `users_lifestyle_information` WRITE;
/*!40000 ALTER TABLE `users_lifestyle_information` DISABLE KEYS */;
INSERT INTO `users_lifestyle_information` VALUES (1,0,1,1,1,0);
/*!40000 ALTER TABLE `users_lifestyle_information` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_medical_history`
--

DROP TABLE IF EXISTS `users_medical_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_medical_history` (
  `id` int(11) NOT NULL,
  `heart_history` int(11) DEFAULT NULL,
  `stroke` int(11) DEFAULT NULL,
  `disability` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `users_medical_history_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_medical_history`
--

LOCK TABLES `users_medical_history` WRITE;
/*!40000 ALTER TABLE `users_medical_history` DISABLE KEYS */;
INSERT INTO `users_medical_history` VALUES (1,1,0,1);
/*!40000 ALTER TABLE `users_medical_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-28  1:11:15
