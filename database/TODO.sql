ALTER TABLE card
ALTER COLUMN bingo_time TYPE timestamptz USING bingo_time AT TIME ZONE 'UTC';

ALTER TABLE round
ALTER COLUMN start_time TYPE timestamptz USING start_time AT TIME ZONE 'UTC';

-- UPDATE checks
-- SET time = '1970-01-01 15:37:56+00'
-- WHERE time IS NULL;

DROP VIEW v_box_in_card;

ALTER TABLE checks
ALTER COLUMN time TYPE timestamptz USING time AT TIME ZONE 'UTC';

-- UPDATE checks
-- SET time = NULL
-- WHERE time = '1970-01-01 15:37:56+00';

CREATE VIEW v_box_in_card ...;

UPDATE discord_user SET banned = false;
