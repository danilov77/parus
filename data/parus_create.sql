-- CREATE EXTENSION pgcrypto;

DROP INDEX codes_code_idx;
DROP INDEX users_email_idx;
DROP INDEX reglinks_email_idx;
DROP INDEX conflinks_user_idx;
DROP INDEX user_cards_user_idx;

DROP VIEW v_codes;
DROP VIEW v_reglinks;
DROP VIEW v_user_cards;
DROP VIEW v_users;
DROP TABLE codes;
DROP TABLE user_cards;
DROP TABLE reglinks;
DROP TABLE conflinks;
DROP TABLE users;

CREATE TABLE codes(
   id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   code         VARCHAR(20) NOT NULL DEFAULT '-',
   percent      SMALLINT NOT NULL DEFAULT 0,
   is_used      BOOLEAN DEFAULT FALSE,
   expires_at   TIMESTAMPTZ NOT NULL,
   is_expired   BOOLEAN DEFAULT FALSE
);

CREATE TABLE users(
   id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   name         VARCHAR(180) NOT NULL,
   email        VARCHAR(180) NOT NULL,
   is_block     BOOLEAN DEFAULT FALSE,
   pass         VARCHAR(240),
   page_start   VARCHAR(180) DEFAULT 'start',
   lev          SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE user_cards(
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL references users(id),
    birthday        DATE,
    livesplace      VARCHAR(400),
    livesplacelat   REAL,
    livesplacelng   REAL,
    sex             SMALLINT,
    phonenumber     VARCHAR(20),
    phoneconfirm    SMALLINT,
    nationality     VARCHAR(20),
    education       VARCHAR(20),
    height          SMALLINT,
    weight          SMALLINT,
    working         VARCHAR(400),
    hobby           VARCHAR(400),
    about           TEXT,
    photo1          VARCHAR(400),
    photo2          VARCHAR(400),
    photo3          VARCHAR(400),
    photoavatar     VARCHAR(400),
    photomain       SMALLINT,
    balance         SMALLINT DEFAULT 0
);

CREATE TABLE reglinks(
   id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   email      VARCHAR(180) NOT NULL,
   expires_at TIMESTAMPTZ NOT NULL,
   note       VARCHAR(180) NOT NULL,
   send_at    TIMESTAMPTZ
);

CREATE TABLE conflinks(
   id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   user_id    UUID NOT NULL references users(id),
   expires_at TIMESTAMPTZ NOT NULL,
   note       VARCHAR(180)
);

CREATE UNIQUE INDEX codes_code_idx ON codes (code);
CREATE UNIQUE INDEX users_email_idx ON users (email);
CREATE UNIQUE INDEX reglinks_email_idx ON reglinks (email);
CREATE UNIQUE INDEX reglinks_note_idx ON reglinks (note);
CREATE UNIQUE INDEX conflinks_user_idx ON conflinks (user_id);
CREATE UNIQUE INDEX user_cards_user_idx ON user_cards (user_id);

CREATE VIEW v_codes
(uid, tcreated_at, scode, npercent, bis_used, texpires_at, bis_expired)
AS
SELECT id, created_at, code, percent, is_used, expires_at, is_expired
FROM codes;

CREATE VIEW v_reglinks
    (uid, tcreated_at, semail, texpires_at, snote, tsend_at)
AS
SELECT id, created_at, email, expires_at, note, send_at
FROM reglinks;

CREATE VIEW v_users
    (uid, tcreated_at, sname, semail, bis_block, spass, spage_start, nlev)
AS
SELECT id, created_at, name, email, is_block, pass, page_start, lev
FROM users;

CREATE VIEW v_user_cards
    (uid, uuser_id, dbirthday, slivesplace, rlivesplacelat, rlivesplacelng, nsex, sphonenumber, nphoneconfirm,
    snationality, seducation, nheight, nweight, sworking, shobby, tabout, sphoto1,
    sphoto2, sphoto3, sphotoavatar, nphotomain, nbalance)
AS
SELECT id, user_id, birthday, livesplace, livesplacelat, livesplacelng, sex, phonenumber, phoneconfirm,
    nationality, education, height, weight, working, hobby, about, photo1,
    photo2, photo3, photoavatar, photomain, balance
FROM user_cards;
