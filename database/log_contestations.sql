SELECT
    c.contester_discord_id as discord_id, c.time, 'contestation' as type, b.text, ch.url, uco.name, uco.image, c.box_id,
    CASE WHEN uco.token = '' THEN true ELSE false END AS self,
    c.box_id as box_id, c.checker_discord_id as box_checker_discord_id, uch.name as box_checker_name, uch.image as box_checker_image,
    json_agg(
        json_build_object(
            'voter_discord_id', uv.discord_id,
            'voter_name', uv.name,
            'voter_image', uv.image,
            'vote', cv.vote
        )
    ) AS votes
FROM contestation c
INNER JOIN discord_user uco ON uco.discord_id=c.contester_discord_id
INNER JOIN discord_user uch ON uch.discord_id=c.checker_discord_id
INNER JOIN box b ON b.id=c.box_id
INNER JOIN checks ch ON ch.discord_user_discord_id=c.checker_discord_id
    AND ch.box_id=c.box_id
    AND ch.card_owner_discord_id=c.card_owner_discord_id
    AND ch.card_round_number=c.card_round_number
INNER JOIN contestation_vote cv ON c.contester_discord_id = cv.contester_discord_id
    AND c.checker_discord_id = cv.checker_discord_id
    AND c.box_id = cv.box_id
    AND c.card_round_number = cv.card_round_number
INNER JOIN discord_user uv ON uv.discord_id=cv.voter_discord_id
WHERE c.card_round_number = (SELECT MAX(id) FROM round)
GROUP BY c.contester_discord_id, c.time, b.text, ch.url, uco.name, uco.image, c.box_id,
    uco.token,
    c.box_id, c.checker_discord_id, uch.name, uch.image,
    c.card_owner_discord_id, c.card_round_number;
