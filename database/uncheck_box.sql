-- New (current)
WITH deleted AS (
    DELETE FROM checks 
    WHERE discord_user_discord_id IN (
    SELECT u.discord_id
    FROM discord_user u
    WHERE u.token=''
    )
    AND box_id=-1
    AND card_round_number=(SELECT MAX(id) FROM round)
    RETURNING *
)
SELECT u.discord_id AS discord_id, b.text AS box_text, d.url AS url, u.image AS user_image, u.name AS user_name
FROM deleted d
INNER JOIN discord_user u ON d.discord_user_discord_id=u.discord_id
INNER JOIN box b ON d.box_id=b.id;

-- Old
DELETE FROM checks
WHERE discord_user_discord_id = (SELECT discord_id FROM discord_user WHERE token=$1)
AND box_id=$2
AND card_owner_discord_id = (SELECT discord_id FROM discord_user WHERE token=$1)
AND card_round_number=(SELECT MAX(id) FROM round);
