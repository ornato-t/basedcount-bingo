import type { Actions, PageServerLoad } from './$types';
import type { Box } from '$lib/bingo';
import type postgres from 'postgres';

export const load: PageServerLoad = async ({ parent, locals }) => {
    const { sql } = locals;
    const data = await parent();

    //Pulls the most recent card for the user with the provided token
    const ownCard = await sql`
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
        WHERE c.round_number=(SELECT MAX(round_number) FROM card) AND u.token=${data.token ?? ''};
    ` as BoxCheckable[];

    ownCard.splice(12, 0, { about_discord_id: null, id: NaN, text: 'image:/kekw.png', creator_discord_id: '', checked: true });

    return {
        users: data.users,
        token: data.token,
        cards: ownCard
    };
};

export const actions = {
    check: async ({ request, locals }) => {
        const { sql } = locals;

        const formData = await request.formData();
        const token = formData.get('token');
        const boxId = formData.get('box');
        const valueField = formData.get('value') ?? { toString: () => '' };
        const value = valueField.toString() === 'on' ? true : false;

        if (token === null || boxId === null) return;

        if (value) {
            await sql`
                INSERT INTO checks (discord_user_discord_id, box_id, card_owner_discord_id, card_round_number, time)
                SELECT discord_id, ${boxId.toString()}, discord_id, (SELECT MAX(id) FROM round), NOW()
                FROM discord_user
                WHERE token=${token.toString()}
            `;
        } else {
            // await sql`
            
            // `;
        }
    },
    startNewRound: async ({ request, locals }) => {
        const { sql } = locals;

        const formData = await request.formData();
        const token = formData.get('token') ?? null;
        const winners = formData.get('winners') ?? { toString: () => '' };

        const { admin } = (await sql`
            SELECT admin
            FROM discord_user
            WHERE token=${token === null ? null : token.toString()}
            LIMIT 1
        `)[0] as { admin: boolean };

        if (admin) {
            await saveWinners(sql, winners.toString())
            await startRound(sql)
        };
    },
} satisfies Actions;

async function saveWinners(sql: postgres.Sql<Record<string, never>>, winnersStr: string) {
    if (winnersStr === '') return;
    const winners = winnersStr.split(';');

    for (const winner of winners) {
        await sql`
            INSERT INTO discord_user_wins_round (discord_user_discord_id, round_number)
            VALUES (${winner}, (SELECT MAX(id) FROM round)); 
        `
    }

}

async function startRound(sql: postgres.Sql<Record<string, never>>) {
    await sql`
        DO $$
            DECLARE
            user_record discord_user%ROWTYPE;
            new_round_number INTEGER;
            BEGIN
            INSERT INTO round DEFAULT VALUES;
            
            SELECT MAX(id) INTO new_round_number FROM round;
            
            FOR user_record IN SELECT * FROM discord_user
            LOOP      
                INSERT INTO card (owner_discord_id, round_number)
                VALUES (user_record.discord_id, new_round_number);
                
                INSERT INTO box_in_card (box_id, card_owner_discord_id, card_round_number)
                SELECT id, user_record.discord_id, new_round_number
                FROM box
                WHERE about_discord_id IS DISTINCT FROM user_record.discord_id
                ORDER BY RANDOM()
                LIMIT 24;
            END LOOP;
        END $$;
    `;
}

export interface BoxCheckable extends Box {
    checked: boolean;
}