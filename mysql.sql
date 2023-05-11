/*
MySQL Backup
Database: chatim
Backup Time: 2023-05-11 15:26:59
*/

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `content`;
DROP TABLE IF EXISTS `history_session`;
DROP TABLE IF EXISTS `user`;
CREATE TABLE `content` (
  `Id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增Id',
  `SendId` bigint NOT NULL COMMENT '发送人Id',
  `ReciverId` bigint NOT NULL COMMENT '接收人Id',
  `Content` longtext NOT NULL COMMENT '聊天内容',
  `Type` int NOT NULL COMMENT '内容类型：0html文本，1图片',
  `State` int NOT NULL COMMENT '是否发送成功：0否，1是',
  `NoCode` varchar(255) NOT NULL COMMENT '时间戳',
  `CreateDateUtc` varchar(255) NOT NULL COMMENT '创建时间',
  `Title` varchar(255) DEFAULT NULL COMMENT '拓展功能字段',
  `Description` varchar(255) DEFAULT NULL COMMENT '拓展功能字段',
  `Label` varchar(255) DEFAULT NULL COMMENT '拓展功能字段',
  `Thumbnail` varchar(255) DEFAULT NULL COMMENT '拓展功能字段',
  `ReadFlag` tinyint(1) NOT NULL COMMENT '是否阅读：0否，1是',
  `Avatar` varchar(500) DEFAULT NULL COMMENT '头像',
  `SoundStatus` int DEFAULT '0' COMMENT '音频播放状态：0未播放，1播放中，2已播放',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=441 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
CREATE TABLE `history_session` (
  `Id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Id，自增',
  `FormId` bigint NOT NULL COMMENT '来自用户Id',
  `Name` varchar(255) DEFAULT NULL COMMENT '用户名',
  `NickName` varchar(255) NOT NULL COMMENT '昵称',
  `PersonalitySign` varchar(255) DEFAULT NULL COMMENT '个性签名',
  `Mobile` varchar(255) DEFAULT NULL COMMENT '手机号',
  `Region` varchar(255) DEFAULT NULL COMMENT '地区',
  `Avatar` varchar(500) DEFAULT NULL COMMENT '头像',
  `Email` varchar(255) NOT NULL COMMENT '邮箱',
  `ById` bigint NOT NULL COMMENT '归属用户Id',
  PRIMARY KEY (`Id`,`NickName`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
CREATE TABLE `user` (
  `Id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Id，自增',
  `Name` varchar(255) DEFAULT NULL COMMENT '用户名',
  `NickName` varchar(255) NOT NULL COMMENT '昵称',
  `Password` varchar(255) DEFAULT NULL COMMENT '密码',
  `PersonalitySign` varchar(255) DEFAULT NULL COMMENT '个性签名',
  `Mobile` varchar(255) DEFAULT NULL COMMENT '手机号',
  `OnlineState` tinyint DEFAULT NULL COMMENT '在线状态',
  `Region` varchar(255) DEFAULT NULL COMMENT '地区',
  `Avatar` varchar(500) DEFAULT NULL COMMENT '头像',
  `RightPadding` int NOT NULL DEFAULT '0' COMMENT '右边距，仅需要该字段用于移动端',
  `Email` varchar(255) NOT NULL COMMENT '邮箱',
  `HistorySessionList` longtext COMMENT '历史会话列表',
  `OutTradeNo` varchar(255) DEFAULT NULL COMMENT 'socket.id',
  `NoCode` varchar(255) DEFAULT NULL COMMENT '时间戳',
  PRIMARY KEY (`Id`,`NickName`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
BEGIN;
LOCK TABLES `content` WRITE;
DELETE FROM `content`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `history_session` WRITE;
DELETE FROM `history_session`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `user` WRITE;
DELETE FROM `user`;
INSERT INTO `user` (`Id`,`Name`,`NickName`,`Password`,`PersonalitySign`,`Mobile`,`OnlineState`,`Region`,`Avatar`,`RightPadding`,`Email`,`HistorySessionList`,`OutTradeNo`,`NoCode`) VALUES (33, 'test', 'test', '123456', NULL, NULL, 0, NULL, './logo.png', 0, 'test@qq.com', NULL, 'ijTBuSrvd0N89KFwAAAR', '1683725532971'),(34, 'test1', 'test1', '123456', NULL, NULL, 0, NULL, './logo.png', 0, 'test1@qq.com', NULL, 'sey0NLWQOJlcP5AnAAAT', '1683725535204')
;
UNLOCK TABLES;
COMMIT;
