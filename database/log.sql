WITH union_query AS (
    SELECT owner_discord_id AS discord_id, bingo_time AS time, 'bingo' as type, null as text, null as url
    FROM card
    WHERE bingo=true
    UNION
    SELECT discord_user_discord_id AS discord_id, time AS time, 'check' as type, b.text, c.url
    FROM checks c
    INNER JOIN box b ON c.box_id=b.id
)
SELECT uq.discord_id, uq.time, uq.type, uq.text, uq.url, u.discord_id, u.name, u.image
FROM union_query uq
INNER JOIN discord_user u ON uq.discord_id=u.discord_id
ORDER BY uq.time ASC;
