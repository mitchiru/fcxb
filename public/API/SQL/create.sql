CREATE TABLE groups (
  id      INTEGER AUTO_INCREMENT,
  name    VARCHAR(20),
  PRIMARY KEY (id)
);

CREATE TABLE lists (
  id      INTEGER AUTO_INCREMENT,
  name    VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE groups_lists (
  group_id INTEGER,
  list_id INTEGER,
  PRIMARY KEY (group_id,list_id),
  FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
  FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
);

CREATE TABLE users (
  id      INTEGER AUTO_INCREMENT,
  name    VARCHAR(20),
  fb      INTEGER,
  sms     VARCHAR(20),
  email   VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE lists_users (
  user_id INTEGER,
  list_id INTEGER,
  PRIMARY KEY (user_id,list_id),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
);


CREATE TABLE events (
  id        INTEGER AUTO_INCREMENT,
  name      VARCHAR(60),
  group_id  INTEGER,
  canceled  BOOLEAN NOT NULL DEFAULT FALSE,
  private   BOOLEAN NOT NULL DEFAULT FALSE,
  crdate    INTEGER,
  chdate    INTEGER,
  evdate    INTEGER,
  description VARCHAR(255),
  min_att   INTEGER,
  max_att   INTEGER,
  location  VARCHAR(255),

  PRIMARY KEY (id),
  FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE
);

CREATE TABLE event_lists (
  event_id INTEGER,
  list_id INTEGER,
  PRIMARY KEY (event_id,list_id),
  FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
  FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
);

CREATE TABLE registrations (
  id        INTEGER AUTO_INCREMENT,
  event_id  INTEGER,
  user      VARCHAR(35),
  crdate    INTEGER,
  chdate    INTEGER,
  confirmed BOOLEAN DEFAULT true,
  sub       BOOLEAN DEFAULT false,
  pos_x     INTEGER,
  pos_y     INTEGER,

  PRIMARY KEY (id),
  FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);

/*CREATE VIEW _event__users AS SELECT e.*, u.id AS user_id, u.name as user_name, eu.crdate AS user_crdate, eu.chdate AS user_chdate, eu.confirmed AS user_confirmed FROM events e LEFT OUTER JOIN event_users eu ON e.id = eu.event_id INNER JOIN users u ON eu.user_id = u.id;*/

INSERT INTO groups (name) VALUES ('FCBX');
INSERT INTO lists (name) VALUES ('FCBX #1');
INSERT INTO lists (name) VALUES ('FCBX #2');
INSERT INTO lists (name) VALUES ('Lads');
INSERT INTO lists (name) VALUES ('Soccernk');

INSERT INTO groups_lists (group_id,list_id) VALUES (1,1);
INSERT INTO groups_lists (group_id,list_id) VALUES (1,2);
INSERT INTO groups_lists (group_id,list_id) VALUES (1,3);
INSERT INTO groups_lists (group_id,list_id) VALUES (1,4);

INSERT INTO users (name,email) VALUES ('Michi','mitchiru@gmx.de');
INSERT INTO users (name,email) VALUES ('Doggie','01522 8735816');
INSERT INTO lists_users (list_id,user_id) VALUES (1,1);
INSERT INTO lists_users (list_id,user_id) VALUES (1,2);
INSERT INTO lists_users (list_id,user_id) VALUES (2,1);

INSERT INTO events (name,group_id,crdate,evdate,description,min_att,max_att,location) VALUES ('Regular Tuesday 19:00',1,1429714214,1429714000,'Beers afterwards',8,16,'Görlitzer Park, Berlin, GERMANY');
INSERT INTO registrations (event_id,user) VALUES (1,"Doggie");
INSERT INTO registrations (event_id, user) VALUES (1,"Michi");

INSERT INTO events (name,group_id,crdate,evdate,description,min_att,max_att,location) VALUES ('Regular Tuesday 19:00',1,1429814214,1429814000,'Only Regulars',8,16,'Görlitzer Park, Berlin, GERMANY');
INSERT INTO events (name,group_id,crdate,evdate,description,min_att,max_att,location) VALUES ('Regular Tuesday 19:00',1,1429914214,1429914000,'Only Regulars',8,16,'Görlitzer Park, Berlin, GERMANY');