/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.14-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: react-instagram-clone
-- ------------------------------------------------------
-- Server version	10.11.14-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blocks`
--

DROP TABLE IF EXISTS `blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `blocks` (
  `block_id` int(11) NOT NULL AUTO_INCREMENT,
  `block_by` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `block_time` varchar(100) NOT NULL,
  PRIMARY KEY (`block_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocks`
--

LOCK TABLES `blocks` WRITE;
/*!40000 ALTER TABLE `blocks` DISABLE KEYS */;
INSERT INTO `blocks` VALUES
(6,30,24,'1518512985015'),
(11,7,11,'1518973149200'),
(13,24,20,'1524915826749'),
(15,28,10,'1528222712390');
/*!40000 ALTER TABLE `blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookmarks`
--

DROP TABLE IF EXISTS `bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookmarks` (
  `bkmrk_id` int(11) NOT NULL AUTO_INCREMENT,
  `bkmrk_by` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `bkmrk_time` varchar(100) NOT NULL,
  PRIMARY KEY (`bkmrk_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookmarks`
--

LOCK TABLES `bookmarks` WRITE;
/*!40000 ALTER TABLE `bookmarks` DISABLE KEYS */;
INSERT INTO `bookmarks` VALUES
(2,24,43,'1524497939091'),
(3,24,57,'1526210615506');
/*!40000 ALTER TABLE `bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('text','image','sticker') NOT NULL,
  `text` mediumtext NOT NULL,
  `commentSrc` mediumtext NOT NULL,
  `comment_by` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `comment_time` varchar(100) NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES
(62,'text','mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm','',30,57,'1518509780928'),
(63,'text','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.','',30,57,'1518509825922'),
(64,'text','#Hello','',24,57,'1518710983444'),
(66,'text','wooo @takkar','',7,88,'1518945524771'),
(69,'image','','instagram_comment_1518972851259.jpg',24,89,'1518972851259'),
(70,'text','thnx @ghalib','',24,88,'1518972932739'),
(71,'text','hmmm','',7,88,'1518973041037'),
(73,'text','https://regexr.com/?37i6s fffffm','',24,89,'1519113671582'),
(102,'text','mmmm','',24,61,'1524764250449'),
(103,'sticker','','instagram_comment_1527447892610.jpg',24,43,'1527447892610'),
(104,'sticker','','instagram_comment_1527447929485.jpg',24,43,'1527447929485');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `con_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_one` int(11) NOT NULL,
  `user_two` int(11) NOT NULL,
  `con_time` varchar(100) NOT NULL,
  PRIMARY KEY (`con_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES
(24,24,7,'1518016982813'),
(25,24,27,'1518972996540'),
(29,24,28,'1523883827593'),
(36,28,11,'1525092718181'),
(39,24,18,'1525194237021');
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favourites`
--

DROP TABLE IF EXISTS `favourites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `favourites` (
  `fav_id` int(11) NOT NULL AUTO_INCREMENT,
  `fav_by` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `fav_time` varchar(100) NOT NULL,
  PRIMARY KEY (`fav_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favourites`
--

LOCK TABLES `favourites` WRITE;
/*!40000 ALTER TABLE `favourites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favourites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow_system`
--

DROP TABLE IF EXISTS `follow_system`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow_system` (
  `follow_id` int(11) NOT NULL AUTO_INCREMENT,
  `follow_by` int(11) NOT NULL,
  `follow_by_username` varchar(32) NOT NULL,
  `follow_to` int(11) NOT NULL,
  `follow_to_username` varchar(32) NOT NULL,
  `follow_time` varchar(100) NOT NULL,
  PRIMARY KEY (`follow_id`)
) ENGINE=InnoDB AUTO_INCREMENT=304 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow_system`
--

LOCK TABLES `follow_system` WRITE;
/*!40000 ALTER TABLE `follow_system` DISABLE KEYS */;
/*!40000 ALTER TABLE `follow_system` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_members`
--

DROP TABLE IF EXISTS `group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_members` (
  `grp_member_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `member` int(11) NOT NULL,
  `added_by` int(11) NOT NULL,
  `joined_group` varchar(100) NOT NULL,
  PRIMARY KEY (`grp_member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `bio` varchar(2000) NOT NULL,
  `admin` int(11) NOT NULL,
  `group_type` enum('public','private') NOT NULL DEFAULT 'public',
  `created` varchar(100) NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES
(11,'a groupss','#random group',24,'private','1518016737587'),
(12,'nmnmnmnm','',7,'public','1518973077594');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hashtags`
--

DROP TABLE IF EXISTS `hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `hashtags` (
  `hashtag_id` int(11) NOT NULL AUTO_INCREMENT,
  `hashtag` varchar(1000) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `hashtag_time` varchar(100) NOT NULL,
  PRIMARY KEY (`hashtag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hashtags`
--

LOCK TABLES `hashtags` WRITE;
/*!40000 ALTER TABLE `hashtags` DISABLE KEYS */;
/*!40000 ALTER TABLE `hashtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `like_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `like_by` int(11) NOT NULL,
  `like_time` varchar(100) NOT NULL,
  PRIMARY KEY (`like_id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES
(31,22,12,'1516523221375'),
(33,24,13,'1516523819069'),
(34,23,11,'1516524845235'),
(35,32,10,'1516524986159'),
(36,34,16,'1516525136147'),
(37,35,17,'1516525294230'),
(38,36,18,'1516525560721'),
(39,41,20,'1516527811400'),
(42,43,18,'1516528068337'),
(57,43,23,'1518016342615'),
(58,40,24,'1518016509189'),
(59,39,24,'1518016512324'),
(63,61,27,'1518018364468'),
(64,63,30,'1518510087356'),
(65,57,24,'1518515315123'),
(67,89,28,'1524245733030'),
(69,89,18,'1525862381809'),
(71,69,24,'1526210612292'),
(75,89,24,'1526663921539');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `con_id` int(11) NOT NULL,
  `mssg_by` int(11) NOT NULL,
  `mssg_to` int(11) NOT NULL,
  `message` longtext NOT NULL,
  `type` enum('text','image','sticker') NOT NULL,
  `status` enum('read','unread') NOT NULL DEFAULT 'unread',
  `message_time` varchar(100) NOT NULL,
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES
(77,25,24,27,'hello','text','read','1518973001479'),
(78,24,7,24,'eo','text','read','1518973051916'),
(79,25,24,27,'@takkar','text','read','1519028471421'),
(93,29,28,24,'instagram_message_1525091176544.jpg','sticker','read','1525091176544'),
(94,29,24,28,'kjkjk','text','unread','1525809227238'),
(95,29,24,28,'kjkjk','text','unread','1525809483966'),
(96,39,24,18,'mnm','text','read','1525809590186'),
(99,29,24,28,'instagram_message_1525809886884.jpg','sticker','unread','1525809886884'),
(100,29,24,28,'mnmnmnm','text','unread','1525858483641'),
(101,39,24,18,'kjkj','text','unread','1526481006905'),
(102,29,24,28,'instagram_message_1528278864884.jpg','image','unread','1528278864884');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notify_id` int(11) NOT NULL AUTO_INCREMENT,
  `notify_by` int(11) NOT NULL,
  `notify_to` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `type` enum('follow','tag','like','share','shared_your_post','comment','favourites','recommend','add_grp_member','invite','change_admin','new_con','mention_post','mention_comment') NOT NULL,
  `user` int(11) NOT NULL,
  `notify_time` varchar(100) NOT NULL,
  `status` enum('read','unread') NOT NULL DEFAULT 'unread',
  PRIMARY KEY (`notify_id`)
) ENGINE=InnoDB AUTO_INCREMENT=633 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_tags`
--

DROP TABLE IF EXISTS `post_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_tags` (
  `post_tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  PRIMARY KEY (`post_tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_tags`
--

LOCK TABLES `post_tags` WRITE;
/*!40000 ALTER TABLE `post_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `description` mediumtext NOT NULL,
  `imgSrc` mediumtext NOT NULL,
  `filter` varchar(100) NOT NULL DEFAULT 'normal',
  `location` mediumtext NOT NULL,
  `type` enum('user','group') NOT NULL DEFAULT 'user',
  `group_id` int(11) NOT NULL,
  `post_time` varchar(100) NOT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES
(91,29,'Exploring new horizons in science and technology. #innovation #science','instagram_1516522776339.jpg','filter-normal','Princeton, NJ','user',0,'1784712416757'),
(92,29,'Experimentation is the key to understanding nature. #physics #discovery','instagram_1516523468369.jpg','filter-normal','Cambridge, UK','user',0,'1784710616759'),
(93,30,'Experimentation is the key to understanding nature. #physics #discovery','instagram_1516523813005.jpg','filter-normal','Cambridge, UK','user',0,'1784708816761'),
(94,31,'Mathematics reveals the hidden patterns of the cosmos. #math #universe','instagram_1516524010087.jpg','filter-normal','Paris, France','user',0,'1784705216763'),
(95,31,'Breakthrough in the laboratory today! #research #tech','instagram_1516524031664.jpg','filter-normal','London, UK','user',0,'1784703416766'),
(96,32,'Breakthrough in the laboratory today! #research #tech','instagram_1516524056911.jpg','filter-normal','London, UK','user',0,'1784701616768'),
(97,34,'The beauty of nature is found in its fundamental laws. #nature #science','instagram_1516524098767.jpg','filter-normal','Stockholm, Sweden','user',0,'1784698016771'),
(98,34,'Coding the future, one algorithm at a time. #computer #technology','instagram_1516524133694.jpg','filter-normal','Geneva, Switzerland','user',0,'1784696216772'),
(99,35,'Coding the future, one algorithm at a time. #computer #technology','instagram_1516524190576.jpg','filter-normal','Geneva, Switzerland','user',0,'1784694416774'),
(100,36,'Observation and evidence guide all scientific progress. #astronomy #astrophysics','instagram_1516524753923.jpg','filter-normal','Pasadena, CA','user',0,'1784690816775'),
(101,36,'Pioneering new techniques for the next generation. #engineering #innovation','instagram_1516524981153.jpg','filter-normal','Boston, MA','user',0,'1784689016777'),
(102,37,'Pioneering new techniques for the next generation. #engineering #innovation','instagram_1516525040077.jpg','filter-normal','Boston, MA','user',0,'1784687216779'),
(103,38,'A wonderful day sharing knowledge with fellow minds. #education #science','instagram_1516525129889.jpg','filter-normal','Berlin, Germany','user',0,'1784683616781'),
(104,38,'Simplicity is the ultimate sophistication. #tech #design','instagram_1516525289046.jpg','filter-normal','New York, NY','user',0,'1784681816782'),
(105,39,'Simplicity is the ultimate sophistication. #tech #design','instagram_1516525555814.jpg','filter-normal','New York, NY','user',0,'1784680016784'),
(106,40,'Exploring new horizons in science and technology. #innovation #science','instagram_1516525648412.jpg','filter-normal','Princeton, NJ','user',0,'1784676416785'),
(107,40,'Experimentation is the key to understanding nature. #physics #discovery','instagram_1516525703299.jpg','filter-normal','Cambridge, UK','user',0,'1784674616787'),
(108,41,'Experimentation is the key to understanding nature. #physics #discovery','instagram_1516527391527.jpg','filter-normal','Cambridge, UK','user',0,'1784672816788'),
(109,42,'Mathematics reveals the hidden patterns of the cosmos. #math #universe','instagram_1516527403042.jpg','filter-normal','Paris, France','user',0,'1784669216790'),
(110,42,'Breakthrough in the laboratory today! #research #tech','instagram_1516527804372.jpg','filter-normal','London, UK','user',0,'1784667416791'),
(111,43,'Breakthrough in the laboratory today! #research #tech','instagram_1516528062094.jpg','filter-normal','London, UK','user',0,'1784665616793'),
(112,44,'The beauty of nature is found in its fundamental laws. #nature #science','instagram_1516719699046.jpg','filter-normal','Stockholm, Sweden','user',0,'1784662016795'),
(113,44,'Coding the future, one algorithm at a time. #computer #technology','instagram_1518016704834.jpg','filter-normal','Geneva, Switzerland','user',0,'1784660216796'),
(114,45,'Coding the future, one algorithm at a time. #computer #technology','instagram_1518018358758.jpg','filter-normal','Geneva, Switzerland','user',0,'1784658416798'),
(115,46,'Observation and evidence guide all scientific progress. #astronomy #astrophysics','instagram_1518510077635.jpg','filter-normal','Pasadena, CA','user',0,'1784654816799'),
(116,46,'Pioneering new techniques for the next generation. #engineering #innovation','instagram_1518854775824.jpg','filter-normal','Boston, MA','user',0,'1784653016800'),
(117,47,'Pioneering new techniques for the next generation. #engineering #innovation','instagram_1518857912246.jpg','filter-normal','Boston, MA','user',0,'1784651216802'),
(118,48,'A wonderful day sharing knowledge with fellow minds. #education #science','instagram_1518945386167.jpg','filter-normal','Berlin, Germany','user',0,'1784647616803'),
(119,48,'Simplicity is the ultimate sophistication. #tech #design','instagram_1518972814710.jpg','filter-normal','New York, NY','user',0,'1784645816805'),
(120,49,'Simplicity is the ultimate sophistication. #tech #design','instagram_1516522776339.jpg','filter-normal','New York, NY','user',0,'1784644016807'),
(121,50,'Exploring new horizons in science and technology. #innovation #science','instagram_1516523468369.jpg','filter-normal','Princeton, NJ','user',0,'1784640416808'),
(122,50,'Experimentation is the key to understanding nature. #physics #discovery','instagram_1516523813005.jpg','filter-normal','Cambridge, UK','user',0,'1784638616809'),
(123,51,'Experimentation is the key to understanding nature. #physics #discovery','instagram_1516524010087.jpg','filter-normal','Cambridge, UK','user',0,'1784636816810'),
(124,52,'Mathematics reveals the hidden patterns of the cosmos. #math #universe','instagram_1516524031664.jpg','filter-normal','Paris, France','user',0,'1784633216811'),
(125,52,'Breakthrough in the laboratory today! #research #tech','instagram_1516524056911.jpg','filter-normal','London, UK','user',0,'1784631416813'),
(126,53,'Breakthrough in the laboratory today! #research #tech','instagram_1516524098767.jpg','filter-normal','London, UK','user',0,'1784629616817');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_views`
--

DROP TABLE IF EXISTS `profile_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_views` (
  `view_id` int(11) NOT NULL AUTO_INCREMENT,
  `view_by` int(11) NOT NULL,
  `view_to` int(11) NOT NULL,
  `view_time` varchar(100) NOT NULL,
  PRIMARY KEY (`view_id`)
) ENGINE=InnoDB AUTO_INCREMENT=470 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_views`
--

LOCK TABLES `profile_views` WRITE;
/*!40000 ALTER TABLE `profile_views` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations`
--

DROP TABLE IF EXISTS `recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations` (
  `recommend_id` int(11) NOT NULL AUTO_INCREMENT,
  `recommend_by` int(11) NOT NULL,
  `recommend_to` int(11) NOT NULL,
  `recommend_of` int(11) NOT NULL,
  `recommend_time` varchar(100) NOT NULL,
  PRIMARY KEY (`recommend_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations`
--

LOCK TABLES `recommendations` WRITE;
/*!40000 ALTER TABLE `recommendations` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shares`
--

DROP TABLE IF EXISTS `shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `shares` (
  `share_id` int(11) NOT NULL AUTO_INCREMENT,
  `share_by` int(11) NOT NULL,
  `share_to` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `share_time` varchar(100) NOT NULL,
  PRIMARY KEY (`share_id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shares`
--

LOCK TABLES `shares` WRITE;
/*!40000 ALTER TABLE `shares` DISABLE KEYS */;
INSERT INTO `shares` VALUES
(94,27,24,61,'1518018368656'),
(98,24,28,61,'1524496868576'),
(100,24,28,88,'1524496883422'),
(103,24,28,43,'1524496908401'),
(105,24,27,61,'1524739767695'),
(112,24,28,89,'1526745599923'),
(113,24,10,89,'1526745635584'),
(114,24,11,89,'1526745636581');
/*!40000 ALTER TABLE `shares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `tag` varchar(255) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES
(1,29,'apple');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `firstname` varchar(32) NOT NULL,
  `surname` varchar(32) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` varchar(1000) NOT NULL DEFAULT '',
  `joined` varchar(100) NOT NULL DEFAULT '',
  `email_verified` enum('yes','no') NOT NULL DEFAULT 'no',
  `account_type` enum('public','private') NOT NULL DEFAULT 'public',
  `instagram` varchar(500) NOT NULL DEFAULT '',
  `twitter` varchar(500) NOT NULL DEFAULT '',
  `facebook` varchar(500) NOT NULL DEFAULT '',
  `github` varchar(500) NOT NULL DEFAULT '',
  `website` varchar(500) NOT NULL DEFAULT '',
  `phone` varchar(20) NOT NULL DEFAULT '',
  `isOnline` enum('yes','no') NOT NULL DEFAULT 'no',
  `lastOnline` varchar(100) NOT NULL DEFAULT '',
  `is_active` enum('yes','no') DEFAULT 'yes',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(29,'steve_jobs','steve','jobs','steve_jobs@gmail.com','$2a$10$B05HNF3/pnK.8fU7kCJHpuaU5LpVxwao9Wmkn3Md2sAPc5GINiU6O','','1518018498672','no','public','','','','','','','no','','yes'),
(30,'doraemon','iam_','doraemon','doraemon@gmail.com','$2a$10$OjZg/mosNPOT297skkotUetzYL7mIEFDVxVPP2lsBAv4F0LSyK18m','','1518454660501','no','public','','','','','','','no','1525801713580','yes'),
(31,'superadmin','Super','Admin','superadmin@gmail.com','$2a$10$FN1Jqz1E98WQGJa0hIl6K.6t6k1JMsWbYh3BYmGc8dXfXvaD/WkzK','','1518454660501','yes','public','','','','','','','no','1784715201978','yes'),
(32,'User','User','Account','user@gmail.com','$2a$10$XhrBqHCAjusXAoxRg.v6vujvI/KxYFbwow5DXgANLtwg5dgCHSD5O','','1518454660501','yes','public','','','','','','','no','1525801713580','yes'),
(34,'einstein','Albert','Einstein','einstein@gmail.com','$2a$10$qNUBS79os3ueUuqkt6jbc.IhP0ZMG2rYOW0zSOPuJfrocQVpB1aBK','Theoretical physicist. Developed the theory of relativity. Nobel Laureate.','1784710541130','yes','public','','','','','','','no','','yes'),
(35,'newton','Isaac','Newton','newton@gmail.com','$2a$10$wg3416D0L5fntPfucQOh1uVfFP4QCFXwkzyUGHKI6Hcd9kujiizSq','Mathematician & Physicist. Formulated laws of motion and universal gravitation.','1784710541352','yes','public','','','','','','','no','','yes'),
(36,'tesla','Nikola','Tesla','tesla@gmail.com','$2a$10$HJFeCLH5XZskfCxd4f/1qeN71HyeMk8JWhNv4.txKQ9OuCD.mx.JO','Inventor & Electrical Engineer. Pioneer of alternating current (AC) power.','1784710541570','yes','public','','','','','','','no','','yes'),
(37,'curie','Marie','Curie','curie@gmail.com','$2a$10$ETc7TEHYyRZJspSVEmBGmejeXcr0sz3IFl.bHXJhQQLecPg9giSZ.','Physicist & Chemist. Pioneer in radioactivity research. Two-time Nobel Laureate.','1784710541790','yes','public','','','','','','','no','','yes'),
(38,'lovelace','Ada','Lovelace','lovelace@gmail.com','$2a$10$49FTia4CrDlQakrDDH8DtezkPUghb9rN.AHkmNQqLL7het6tzKh6O','Mathematician & Computing pioneer. Written first mechanical computer algorithm.','1784710542007','yes','public','','','','','','','no','','yes'),
(39,'turing','Alan','Turing','turing@gmail.com','$2a$10$/laXGrg1y4MVIqEXGVx6leuYU6Ni87D25a9W3DUbhl7dCTDTQGLsm','Father of modern computer science and artificial intelligence.','1784710542226','yes','public','','','','','','','no','','yes'),
(40,'darwin','Charles','Darwin','darwin@gmail.com','$2a$10$ZQmECm96peH2zE5trOGt0OkkzP6/0R9gcIEAtBBGX7MhmwMtIbRza','Naturalist & Evolutionary Biologist. Natural selection theory pioneer.','1784710542449','yes','public','','','','','','','no','','yes'),
(41,'galileo','Galileo','Galilei','galileo@gmail.com','$2a$10$LOb5n9bJZtH0PBzIvRP7Qeh7MAzcAymP2vIGjoVNXfC2ypxnMJLD6','Astronomer & Physicist. Father of observational astronomy.','1784710542669','yes','public','','','','','','','no','','yes'),
(42,'feynman','Richard','Feynman','feynman@gmail.com','$2a$10$50CDm3zMZdELEk5tgfI3VepPaOi72LqiEArNYhkLxpQLMLc1LTpLa','Theoretical physicist known for quantum electrodynamics & Feynman diagrams.','1784710542890','yes','public','','','','','','','no','','yes'),
(43,'hawking','Stephen','Hawking','hawking@gmail.com','$2a$10$oBw5V07co4to/DGKDzRtj.tivglAya49BiAIIAsxs0PIDcyCTGKha','Theoretical physicist & Cosmologist. Black hole physics pioneer.','1784710543108','yes','public','','','','','','','no','','yes'),
(44,'sagan','Carl','Sagan','sagan@gmail.com','$2a$10$vzNhL0KWZ6E1dXSa7ECTge2JRoxs/KFlys40ykQ.nQgK.LHPZLRcy','Astronomer, planetary scientist, and science communicator.','1784710543328','yes','public','','','','','','','no','','yes'),
(45,'hopper','Grace','Hopper','hopper@gmail.com','$2a$10$5yi3BamHZzw2MKMfaJ5/KOOfDiu/1pWzo52rV1NX2tl0WaDP.58iO','Computer scientist, US Navy Rear Admiral. Pioneer of computer programming compilers.','1784710543547','yes','public','','','','','','','no','','yes'),
(46,'johnson','Katherine','Johnson','johnson@gmail.com','$2a$10$jVfxfd5gO5zJzijmXdA9gOydmEjwtgCbnuXScpjRR0k644KhINlKi','NASA mathematician whose calculations were critical to orbital spaceflights.','1784710543764','yes','public','','','','','','','no','','yes'),
(47,'franklin','Rosalind','Franklin','franklin@gmail.com','$2a$10$G.Mahuu5T6jW3ZE1dCAR2eaiNUg9bhh3/aEXC6YZrZKcyqmh69lXu','Chemist & X-ray crystallographer. Discovered double helix structure of DNA.','1784710543988','yes','public','','','','','','','no','','yes'),
(48,'edison','Thomas','Edison','edison@gmail.com','$2a$10$FiwAS.BtS36X05xh7e9sfeTgLUnULc23LSOgRB5/3AYCpj/fgnJKm','Prolific inventor & businessman. Developed electric light, phonograph & motion picture.','1784710544213','yes','public','','','','','','','no','','yes'),
(49,'bell','Alexander','Bell','bell@gmail.com','$2a$10$JVEw4HuJnsQpTTeF2AvIbuJILoPGZeSiFwyntS9hrK9B6LseEjorW','Inventor, scientist, and engineer credited with patenting the first practical telephone.','1784710544436','yes','public','','','','','','','no','','yes'),
(50,'berners_lee','Tim','Berners-Lee','berners_lee@gmail.com','$2a$10$LMcXonK.wP4yRYuYrivO1.83s5zRNQi2.hmOM4hD6OzaehlBaLoIu','Computer scientist & inventor of the World Wide Web.','1784710544660','yes','public','','','','','','','no','','yes'),
(51,'torvalds','Linus','Torvalds','torvalds@gmail.com','$2a$10$nsN9.5prVYTSvuPsD1jFY.PnLAjN8nfmadwvkLFjOAXVxxJlRNMNy','Software engineer. Creator of the Linux kernel and Git version control.','1784710544883','yes','public','','','','','','','no','','yes'),
(52,'hamilton','Margaret','Hamilton','hamilton@gmail.com','$2a$10$FIKgN3sskKA90yi2.d8D9eGGI5OXtKJZOTfKPCuLI0PLyfTi4pLCa','Computer scientist. Director of Software Engineering for NASA Apollo Space Program.','1784710545112','yes','public','','','','','','','no','','yes'),
(53,'lamarr','Hedy','Lamarr','lamarr@gmail.com','$2a$10$8XjE1Gq6rF.fCqzpz0K/VO037Yboxg3RnIQHHEdDFTnymJxu8xpRu','Inventor & Actress. Co-invented frequency-hopping spread spectrum technology.','1784710545331','yes','public','','','','','','','no','','yes');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-22 11:27:42
