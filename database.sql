CREATE TABLE IF NOT EXISTS `t_articles` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `feed_id` mediumint(9) DEFAULT NULL,
  `status` varchar(10) CHARACTER SET utf8 DEFAULT NULL,
  `star_ind` int(1) NOT NULL DEFAULT '0',
  `url` varchar(400) CHARACTER SET utf8 DEFAULT NULL,
  `subject` varchar(400) CHARACTER SET utf8 DEFAULT NULL,
  `content` text CHARACTER SET utf8,
  `insert_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `publish_date` datetime DEFAULT NULL,
  `author` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_2` (`id`),
  KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `t_categories` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(600) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_2` (`id`),
  KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `t_feeds` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `feed_name` varchar(200) CHARACTER SET utf8 NOT NULL,
  `feed_desc` varchar(2000) CHARACTER SET utf8 DEFAULT NULL,
  `url` varchar(200) CHARACTER SET utf8 NOT NULL,
  `category_id` varchar(200) CHARACTER SET utf8 NOT NULL DEFAULT '1',
  `favicon` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `last_update` datetime DEFAULT NULL,
  `insert_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_2` (`id`),
  KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

INSERT INTO `t_categories` (`id`, `category_name`) VALUES (1, 'Uncategorized');