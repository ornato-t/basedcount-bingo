/* Ran on PostgreSQL 13.9 */
CREATE TABLE discord_user (
    discord_id TEXT NOT NULL,
    name TEXT NOT NULL,
    admin BOOL NOT NULL,
    image TEXT NOT NULL,
    banner TEXT,
    token TEXT NOT NULL,
    PRIMARY KEY (discord_id)
);
CREATE TABLE box (
    id SERIAL,
    text TEXT NOT NULL,
    creator_discord_id TEXT NOT NULL,
    about_discord_id TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (creator_discord_id) REFERENCES discord_user(discord_id),
    FOREIGN KEY (about_discord_id) REFERENCES discord_user(discord_id)
);
CREATE TABLE round (
    number TEXT NOT NULL,
    PRIMARY KEY (number)
);
CREATE TABLE card (
    owner_discord_id TEXT NOT NULL,
    round_number TEXT NOT NULL,
    PRIMARY KEY (owner_discord_id, round_number),
    FOREIGN KEY (owner_discord_id) REFERENCES discord_user(discord_id),
    FOREIGN KEY (round_number) REFERENCES round(number)
);
CREATE TABLE box_in_card (
    box_id INTEGER NOT NULL,
    card_user_discord_id TEXT NOT NULL,
    card_round_number TEXT NOT NULL,
    PRIMARY KEY (box_id, card_user_discord_id, card_round_number),
    FOREIGN KEY (box_id) REFERENCES box(id),
    FOREIGN KEY (card_user_discord_id, card_round_number) REFERENCES card(owner_discord_id, round_number)
);
CREATE TABLE discord_user_wins_round (
    discord_user_discord_id TEXT NOT NULL,
    round_number TEXT NOT NULL,
    PRIMARY KEY (discord_user_discord_id, round_number),
    FOREIGN KEY (discord_user_discord_id) REFERENCES discord_user(discord_id),
    FOREIGN KEY (round_number) REFERENCES round(number)
);
CREATE TABLE checks (
    discord_user_discord_id TEXT NOT NULL,
    box_id INTEGER NOT NULL,
    time timestamp NOT NULL,
    PRIMARY KEY (discord_user_discord_id, box_id),
    FOREIGN KEY (discord_user_discord_id) REFERENCES discord_user(discord_id),
    FOREIGN KEY (box_id) REFERENCES BOX(id)
);