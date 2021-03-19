--- load with 
--- psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f schema.sql
DROP TABLE IF EXISTS ftduser CASCADE;
CREATE TABLE ftduser (
    username VARCHAR(20) PRIMARY KEY,
    password BYTEA NOT NULL,
    difficulty VARCHAR(4) NOT NULL /* can be easy, medi or hard */
);

DROP TABLE IF EXISTS ftdwins;
CREATE TABLE ftdwins (
    username VARCHAR(20) 
        REFERENCES ftduser (username)
        ON DELETE CASCADE
        PRIMARY KEY,
    wins int NOT NULL,
    score int NOT NULL
);

--- Could have also stored as 128 character hex encoded values
--- select char_length(encode(sha512('abc'), 'hex')); --- returns 128
--- add wins, since this is done with registration...
INSERT INTO ftduser VALUES('user1', sha512('password1'), 'easy');
INSERT INTO ftdwins VALUES('user1', 1, 1);
INSERT INTO ftduser VALUES('user2', sha512('password2'), 'medi');
INSERT INTO ftdwins VALUES('user2', 2, 2);
INSERT INTO ftduser VALUES('a', sha512('a'), 'hard');
INSERT INTO ftdwins VALUES('a', 3, 3);