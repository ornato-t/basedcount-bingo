DELETE FROM checks
WHERE discord_user_discord_id = (SELECT discord_id FROM discord_user WHERE token=$1)
AND box_id=$2
AND card_owner_discord_id = (SELECT discord_id FROM discord_user WHERE token=$1)
AND card_round_number=(SELECT MAX(id) FROM round);
