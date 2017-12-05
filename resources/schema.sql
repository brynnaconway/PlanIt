DROP TABLE IF EXISTS events;
CREATE TABLE events (
  eventID      INT NOT NULL AUTO_INCREMENT,
  eventName    VARCHAR(30),
  start        DATETIME,
  stop         DATETIME,
  lodgeID      INT,
  groupID      INT,
  confirmCount INT,
  admin        INT,
  location     INT,
  PRIMARY KEY (eventID)
);

DROP TABLE IF EXISTS memberships;
CREATE TABLE memberships (
  groupID  INT NOT NULL,
  personID INT NOT NULL,
  PRIMARY KEY (groupID, personID)
);

DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
  groupID   INT         NOT NULL AUTO_INCREMENT,
  groupName VARCHAR(30) NOT NULL,
  PRIMARY KEY (groupID)
);


DROP TABLE IF EXISTS lodging;
CREATE TABLE lodging (
  lodgeID INT          NOT NULL AUTO_INCREMENT,
  price   REAL         NOT NULL,
  address VARCHAR(100) NOT NULL,
  url     VARCHAR(200),
  PRIMARY KEY (lodgeID)
);

DROP TABLE IF EXISTS timerange;
CREATE TABLE timerange (
  personID INT      NOT NULL,
  eventID  INT      NOT NULL,
  start    DATETIME NOT NULL,
  stop     DATETIME NOT NULL,
  PRIMARY KEY (personID, eventID, start)
);

DROP TABLE IF EXISTS people;
CREATE TABLE people (
  personID    INT NOT NULL AUTO_INCREMENT,
  name        VARCHAR(50),
  phoneNumber VARCHAR(20),
  email       VARCHAR(50),
  password    VARCHAR(93),
  PRIMARY KEY (personID)
);

DROP TABLE IF EXISTS votes;
CREATE TABLE votes (
  eventID   INT NOT NULL,
  personID  INT NOT NULL,
  groupID   INT NOT NULL,
  lodgeVote INT,
  locationVote INT,
  startVote DATETIME,
  stopVote  DATETIME,
  PRIMARY KEY (eventID, personID)
);

DROP TABLE IF EXISTS commits;
CREATE TABLE commits (
  personID INT NOT NULL,
  eventID  INT NOT NULL,
  groupID  INT NOT NULL,
  decision BIT,
  PRIMARY KEY (personID, eventID)
);

DROP TABLE IF EXISTS locations;
CREATE TABLE locations (
  locationID      INT NOT NULL AUTO_INCREMENT,
  location    VARCHAR(150),
  eventID        INT,
  votes       INT,
  PRIMARY KEY (locationID, eventID)
);
