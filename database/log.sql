WITH union_query AS (
        SELECT owner_discord_id AS discord_id, bingo_time AS time, 'bingo' as type, null as text, null as url, round_number as round, -1 as box_id
        FROM card
        WHERE bingo=true
    UNION
        SELECT discord_user_discord_id AS discord_id, time AS time, 'check' as type, b.text, c.url, card_round_number as round, c.box_id as box_id
        FROM checks c
        INNER JOIN box b ON c.box_id=b.id
)
SELECT uq.discord_id, uq.time, uq.type, uq.text, uq.url, u.discord_id, u.name, u.image, uq.box_id,
       CASE WHEN u.token = '' THEN true ELSE false END AS self
FROM union_query uq
INNER JOIN discord_user u ON uq.discord_id=u.discord_id
WHERE uq.round=(SELECT MAX(id) FROM round)
ORDER BY uq.time ASC;