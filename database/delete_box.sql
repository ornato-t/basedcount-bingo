DELETE FROM box 
WHERE id IN (
  SELECT b.id 
  FROM box b
  INNER JOIN discord_user u ON b.creator_discord_id = u.discord_id
  WHERE b.id = 15 AND u.token = ''
)
