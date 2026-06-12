DROP TABLE IF EXISTS upcoming_shows;
DROP TABLE IF EXISTS venues;

CREATE TABLE venues (
    id          SERIAL PRIMARY KEY,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    name        VARCHAR(200) NOT NULL,
    emoji       VARCHAR(10),
    genre       VARCHAR(100),
    neighborhood VARCHAR(100),
    address     VARCHAR(200),
    short_desc  TEXT,
    full_desc   TEXT,
    cover_charge INTEGER DEFAULT 0,
    age_restriction VARCHAR(20),
    capacity    INTEGER,
    hours       VARCHAR(100),
    best_night  VARCHAR(100),
    vibe        VARCHAR(100)
);

CREATE TABLE upcoming_shows (
    id        SERIAL PRIMARY KEY,
    venue_id  INTEGER REFERENCES venues(id) ON DELETE CASCADE,
    show_date VARCHAR(50),
    artist    VARCHAR(200),
    price     INTEGER DEFAULT 0
);