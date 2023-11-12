-- Pulls one's most recent card
 SELECT v.id, v.text, v.checked, v.about_discord_id, v.checked, u.image as about_image
FROM v_box_in_card v
INNER JOIN discord_user u ON v.about_discord_id=u.discord_id
WHERE v.token=${data.token ?? ''}
ORDER BY position ASC;

-- Alias for
SELECT 
    b.id, 
    b.text, 
    b.about_discord_id,
    CASE 
        WHEN ch.time IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS checked
FROM box b
INNER JOIN box_in_card bc ON b.id=bc.box_id
INNER JOIN card c ON bc.card_owner_discord_id=c.owner_discord_id AND bc.card_round_number=c.round_number
INNER JOIN discord_user u ON bc.card_owner_discord_id=u.discord_id
LEFT JOIN checks ch ON ch.discord_user_discord_id=u.discord_id AND ch.box_id=b.id AND ch.card_owner_discord_id=c.owner_discord_id AND ch.card_round_number=c.round_number
WHERE c.round_number=(SELECT MAX(round_number) FROM card) AND u.token='';
