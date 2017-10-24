DROP TABLE IF EXISTS events ;
CREATE TABLE events(
   eventID INT NOT NULL AUTO_INCREMENT,
   start DATETIME,
   stop DATETIME,
   lodgeID INT,
   groupID INT,
   locationID INT,
   confirmCount INT,
   PRIMARY KEY ( eventID )
);

DROP TABLE IF EXISTS groups;
CREATE TABLE groups(
	personID INT NOT NULL,
	groupID INT NOT NULL,
	PRIMARY KEY (personID, groupID)
);

DROP TABLE IF EXISTS lodging;
CREATE TABLE lodging(
	lodgeID INT NOT NULL AUTO_INCREMENT,
	price REAL NOT NULL,
	Address VARCHAR(100) NOT NULL,
	URL VARCHAR(200),
	PRIMARY KEY (lodgeID)
);

DROP TABLE IF EXISTS timerange;
CREATE TABLE timerange(
	personID INT NOT NULL,
	eventID INT NOT NULL,
	start DATETIME NOT NULL,
	stop DATETIME NOT NULL,
	PRIMARY KEY (personID, eventID)
);

DROP TABLE IF EXISTS person;
CREATE TABLE person(
	personID INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(50),
	phoneNumber VARCHAR(20),
	PRIMARY KEY (personID)
);

DROP TABLE IF EXISTS vote;
CREATE TABLE vote(
	eventID INT NOT NULL,
	personID INT NOT NULL,
	lodgeVote INT,
	locationVote INT,
	startVote DATETIME, 
	stopVote DATETIME,
	PRIMARY KEY (eventID, personID)
);

DROP TABLE IF EXISTS commits;
CREATE TABLE commits(
	personID INT NOT NULL,
	eventID INT NOT NULL,
	decision BIT,
	PRIMARY KEY (personID, eventID)
);