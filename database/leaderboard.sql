SELECT name, image, banner, COUNT(round_number) as victories, ARRAY_AGG(round_number) as rounds, 
    DENSE_RANK() OVER (ORDER BY COUNT(round_number) DESC) as place
FROM discord_user_wins_round w
INNER JOIN discord_user u ON w.discord_user_discord_id=u.discord_id
GROUP BY name, image, banner
ORDER BY victories DESC;

SELECT r.id as round_number, ARRAY_AGG((name, image, banner)) as winners
FROM discord_user_wins_round w
INNER JOIN discord_user u ON w.discord_user_discord_id=u.discord_id
RIGHT JOIN round r ON r.id=w.round_number
GROUP BY r.id
ORDER BY round_number ASC;