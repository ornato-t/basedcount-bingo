SELECT c.bingo
FROM card c
INNER JOIN discord_user u ON c.owner_discord_id=u.discord_id
WHERE c.round_number = (SELECT MAX(id) FROM round) AND u.token=''

UPDATE card
SET bingo=TRUE
WHERE round_number=(SELECT MAX(id) FROM round) AND owner_discord_id=(
    SELECT discord_id
    FROM discord_user
    WHERE token=''
)