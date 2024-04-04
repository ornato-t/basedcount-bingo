WITH winner_check AS (
    SELECT bingo
    FROM card
    WHERE owner_discord_id = ${winner} AND bingo = TRUE
    ORDER BY round_number DESC
    LIMIT 1
)
INSERT INTO discord_user_wins_round (discord_user_discord_id, round_number)
SELECT ${winner}, (SELECT MAX(id) FROM round)
WHERE EXISTS (SELECT 1 FROM winner_check WHERE bingo = TRUE);