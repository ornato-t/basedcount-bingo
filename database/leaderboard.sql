SELECT name, image, banner, COUNT(round_number) as victories, 
    DENSE_RANK() OVER (ORDER BY COUNT(round_number) DESC) as place
FROM discord_user_wins_round w
RIGHT JOIN discord_user u ON w.discord_user_discord_id=u.discord_id
WHERE u.player = true
GROUP BY name, image, banner
ORDER BY victories DESC, name ASC;;

SELECT r.id as round_number, ARRAY_AGG((name, image, banner)) as winners
FROM discord_user_wins_round w
INNER JOIN discord_user u ON w.discord_user_discord_id=u.discord_id
RIGHT JOIN round r ON r.id=w.round_number
WHERE u.player = true
GROUP BY r.id
ORDER BY round_number ASC;