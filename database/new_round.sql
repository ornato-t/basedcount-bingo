-- This starts a new round and generates a new card for all players
DO $$
DECLARE
   user_record discord_user%ROWTYPE;
   new_round_number INTEGER;
BEGIN
   -- Insert a new round
   INSERT INTO round DEFAULT VALUES;
   
   -- Get the id of the new round
   SELECT MAX(id) INTO new_round_number FROM round;

   FOR user_record IN SELECT * FROM discord_user
   LOOP      
      -- Insert a new card for the new round for the current user
      INSERT INTO card (owner_discord_id, round_number)
      VALUES (user_record.discord_id, new_round_number);
      
      -- Insert 24 random boxes into the card
      INSERT INTO box_in_card (box_id, card_owner_discord_id, card_round_number)
      SELECT id, user_record.discord_id, new_round_number
      FROM box
      ORDER BY RANDOM()
      LIMIT 24;
   END LOOP;
END $$;