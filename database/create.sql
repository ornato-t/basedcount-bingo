/* Ran on PostgreSQL 13.9 */
CREATE TABLE discord_user (
    discord_id TEXT NOT NULL,
    name TEXT NOT NULL,
    admin BOOL NOT NULL,
    image TEXT NOT NULL,
    banner TEXT,
    token TEXT NOT NULL,
    player BOOL NOT NULL DEFAULT true,
    PRIMARY KEY (discord_id)
);
CREATE TABLE box (
    id SERIAL,
    text TEXT NOT NULL,
    creator_discord_id TEXT NOT NULL,
    about_discord_id TEXT,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (creator_discord_id) REFERENCES discord_user(discord_id)
);
CREATE TABLE round (
    id SERIAL NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE card (
    owner_discord_id TEXT NOT NULL,
    round_number INTEGER NOT NULL,
    bingo BOOLEAN NOT NULL DEFAULT FALSE,
    bingo_time timestamp NOT NULL,
    PRIMARY KEY (owner_discord_id, round_number),
    FOREIGN KEY (owner_discord_id) REFERENCES discord_user(discord_id),
    FOREIGN KEY (round_number) REFERENCES round(id)
);
CREATE TABLE box_in_card (
    box_id INTEGER NOT NULL,
    card_owner_discord_id TEXT NOT NULL,
    card_round_number INTEGER NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (box_id, card_owner_discord_id, card_round_number),
    FOREIGN KEY (box_id) REFERENCES box(id),
    FOREIGN KEY (card_owner_discord_id, card_round_number) REFERENCES card(owner_discord_id, round_number)
);
CREATE TABLE discord_user_wins_round (
    discord_user_discord_id TEXT NOT NULL,
    round_number INTEGER NOT NULL,
    PRIMARY KEY (discord_user_discord_id, round_number),
    FOREIGN KEY (discord_user_discord_id) REFERENCES discord_user(discord_id),
    FOREIGN KEY (round_number) REFERENCES round(id)
);
CREATE TABLE checks (
    discord_user_discord_id TEXT NOT NULL,
    box_id INTEGER NOT NULL,
    card_owner_discord_id TEXT NOT NULL,
    card_round_number INTEGER NOT NULL,
    time timestamp,
    url TEXT NOT NULL,
    PRIMARY KEY (discord_user_discord_id, box_id, card_owner_discord_id, card_round_number),
    FOREIGN KEY (discord_user_discord_id) REFERENCES discord_user(discord_id),
    FOREIGN KEY (box_id) REFERENCES BOX(id),
    FOREIGN KEY (card_owner_discord_id, card_round_number) REFERENCES card(owner_discord_id, round_number)
);
CREATE OR REPLACE VIEW v_box_in_card AS
    SELECT 
    b.id, 
    b.text, 
    b.about_discord_id,
    CASE 
        WHEN ch.time IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS checked,
    bc.position,
    u.token,
    ch.time,
    ch.url
    FROM box b
    INNER JOIN box_in_card bc ON b.id=bc.box_id
    INNER JOIN card c ON bc.card_owner_discord_id=c.owner_discord_id AND bc.card_round_number=c.round_number
    INNER JOIN discord_user u ON bc.card_owner_discord_id=u.discord_id
    LEFT JOIN checks ch ON ch.discord_user_discord_id=u.discord_id AND ch.box_id=b.id AND ch.card_owner_discord_id=c.owner_discord_id AND ch.card_round_number=c.round_number
    WHERE c.round_number=(SELECT MAX(round_number) FROM card);
