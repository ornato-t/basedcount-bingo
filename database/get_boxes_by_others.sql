SELECT b.about_discord_id as about_discord_id, ab.name as about_name, ab.image as about_image, cr.name as creator_name, cr.image as creator_image, b.id as box_id, 
       CASE WHEN ab.token = '' THEN NULL ELSE b.text END AS box_text
FROM box b
LEFT JOIN discord_user ab ON ab.discord_id=about_discord_id
INNER JOIN discord_user cr ON cr.discord_id=creator_discord_id
WHERE b.deleted = false AND cr.token != ''
ORDER BY b.id ASC