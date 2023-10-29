-- This starts a new round and generates a new card for all players
DO $$
DECLARE
   user_record discord_user%ROWTYPE;
   box_record box%ROWTYPE;
   new_round_number INTEGER;
   position INTEGER := 0; -- initialize position
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
      
      -- Reset position for each user
      position := 0;

      -- Insert 24 random boxes into the card
      FOR box_record IN (
         SELECT *
         FROM box
         WHERE about_discord_id IS DISTINCT FROM user_record.discord_id
         AND deleted != TRUE
         ORDER BY RANDOM()
         LIMIT 24
      )
      LOOP
         -- Increment position for each box
         position := position + 1;

         INSERT INTO box_in_card (box_id, card_owner_discord_id, card_round_number, position)
         VALUES (box_record.id, user_record.discord_id, new_round_number, position);
      END LOOP;
   END LOOP;
END $$;
