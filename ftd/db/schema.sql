--- load with 
--- psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f schema.sql
DROP TABLE IF EXISTS ftduser;
CREATE TABLE ftduser (
	username VARCHAR(20) PRIMARY KEY,
	password BYTEA NOT NULL
);

DROP TABLE IF EXISTS ftdwins;
CREATE TABLE ftdwins (
	username VARCHAR(20),
	wins int NOT NULL,
	kills int NOT NULL,
	PRIMARY KEY (username),
	FOREIGN KEY (username) REFERENCES ftduser(username) ON DELETE CASCADE
);

--- Could have also stored as 128 character hex encoded values
--- select char_length(encode(sha512('abc'), 'hex')); --- returns 128
INSERT INTO ftduser VALUES('user1', sha512('password1'));
INSERT INTO ftduser VALUES('user2', sha512('password2'));
INSERT INTO ftduser VALUES('a', sha512('a'));