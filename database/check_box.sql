INSERT INTO checks (discord_user_discord_id, box_id, card_owner_discord_id, card_round_number, time)
SELECT discord_id, -1, discord_id, (SELECT MAX(id) FROM round), NOW()
FROM discord_user
WHERE token=''