import type { Actions, PageServerLoad } from './$types';
import type { Box } from '$lib/bingo';
import type postgres from 'postgres';
import { checkBingo } from './bingo';
import { sendBoxAnnouncement } from './discord';
import type { User } from '$lib/user';

export const load: PageServerLoad = async ({ parent, locals, depends }) => {
    const { sql } = locals;
    const data = await parent();

    depends('play');

    //Pulls the most recent card for the user with the provided token
    const ownCard = await sql`
        SELECT id, text, about_discord_id, checked
        FROM v_box_in_card
        WHERE token=${data.token ?? ''}
        ORDER BY position ASC;
    ` as BoxCheckable[];

    ownCard.splice(12, 0, { about_discord_id: null, id: NaN, text: 'image:/kekw.png', creator_discord_id: '', checked: true });

    const log = await sql`
        WITH union_query AS (
                SELECT owner_discord_id AS discord_id, bingo_time AS time, 'bingo' as type, null as text, null as url, round_number as round
                FROM card
                WHERE bingo=true
            UNION
                SELECT discord_user_discord_id AS discord_id, time AS time, 'check' as type, b.text, c.url, card_round_number as round
                FROM checks c
                INNER JOIN box b ON c.box_id=b.id
        )
        SELECT uq.discord_id, uq.time, uq.type, uq.text, uq.url, u.discord_id, u.name, u.image,
            CASE WHEN u.token = ${data.token ?? ''} THEN true ELSE false END AS self
        FROM union_query uq
        INNER JOIN discord_user u ON uq.discord_id=u.discord_id
        WHERE uq.round=(SELECT MAX(id) FROM round)
        ORDER BY uq.time ASC;
    ` as Log[];

    return {
        users: data.users,
        token: data.token,
        cards: ownCard,
        log
    };
};

export const actions = {
    check: async ({ request, locals }) => {
        const { sql } = locals;
        const discordMessageRegex = /https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+\s*$/;

        const formData = await request.formData();
        const token = formData.get('token');
        const boxId = formData.get('box');
        const url = formData.get('url');

        if (token === null || boxId === null) return { failure: true };
        if (Number.isNaN(Number.parseInt(boxId.toString()))) return { failure: true }; //KEKW is already checked

        const tokenStr = token.toString();
        const boxIdStr = boxId.toString();
        const urlStr = url === null ? null : url.toString();

        if (urlStr === null || !discordMessageRegex.test(urlStr)) return { failure: true }; //Ticking a box requires a URL to be specified

        const checkedBoxes = await sql`
            SELECT DISTINCT id
            FROM v_box_in_card
            WHERE checked=true
        ` as { id: number }[];

        await sql`
            INSERT INTO checks (discord_user_discord_id, box_id, card_owner_discord_id, card_round_number, time, url)
            SELECT discord_id, ${boxIdStr}, discord_id, (SELECT MAX(id) FROM round), NOW(), ${urlStr}
            FROM discord_user
            WHERE token=${tokenStr}
        `;

        const box = (await sql`
            SELECT *
            FROM box
            WHERE id=${boxIdStr}
        `)[0] as Box;

        const user = (await sql`
            SELECT *
            FROM discord_user
            WHERE token=${tokenStr}
        `)[0] as User;

        if (!checkedBoxes.some(el => el.id === box.id)) {
            await sendBoxAnnouncement(box, urlStr, user.discord_id, user.image as string, user.name);
        }

        await checkBingo(sql, tokenStr);

        return { success: true };
    },
    uncheck: async ({ request, locals }) => {
        const { sql } = locals;

        const formData = await request.formData();
        const token = formData.get('token');
        const boxId = formData.get('box');

        if (token === null || boxId === null) return { failure: true };
        if (Number.isNaN(Number.parseInt(boxId.toString()))) return { failure: true }; //KEKW can't be unchecked

        const tokenStr = token.toString();
        const boxIdStr = boxId.toString();

        await sql`
            DELETE FROM checks
            WHERE discord_user_discord_id = (SELECT discord_id FROM discord_user WHERE token=${tokenStr})
            AND box_id=${boxIdStr}
            AND card_owner_discord_id = (SELECT discord_id FROM discord_user WHERE token=${tokenStr})
            AND card_round_number=(SELECT MAX(id) FROM round);
        `;

        await checkBingo(sql, tokenStr);

        return { success: true };
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

        if (!admin) return { failure: true };

        const winnersStr = winners.toString();
        if (winnersStr !== '') {
            for (const winner of winnersStr.split(';')) {
                await sql`
                        INSERT INTO discord_user_wins_round (discord_user_discord_id, round_number)
                        VALUES (${winner}, (SELECT MAX(id) FROM round)); 
                    `
            }
        }

        await startRound(sql)

        return { success: true };
    },
    manual: async () => { }
} satisfies Actions;

async function startRound(sql: postgres.Sql<Record<string, never>>) {
    await sql`
        DO $$
            DECLARE
            user_record discord_user%ROWTYPE;
            box_record box%ROWTYPE;
            new_round_number INTEGER;
            position INTEGER := 0;
            BEGIN
            INSERT INTO round DEFAULT VALUES;
            
            SELECT MAX(id) INTO new_round_number FROM round;
            
            FOR user_record IN SELECT * FROM discord_user
            LOOP      
                INSERT INTO card (owner_discord_id, round_number)
                VALUES (user_record.discord_id, new_round_number);
                
                position := 0;
            
                FOR box_record IN (
                    SELECT *
                    FROM box
                    WHERE about_discord_id IS DISTINCT FROM user_record.discord_id
                    AND deleted != TRUE
                    ORDER BY RANDOM()
                    LIMIT 24
                )
                LOOP
                    position := position + 1;
            
                    INSERT INTO box_in_card (box_id, card_owner_discord_id, card_round_number, position)
                    VALUES (box_record.id, user_record.discord_id, new_round_number, position);
                END LOOP;
            END LOOP;
        END $$;
    `;
}

export interface BoxCheckable extends Box {
    checked: boolean;
}

interface LogCheck {
    discord_id: string,
    time: Date,
    type: 'check',
    text: string,
    url: string,
    name: string,
    image: string,
    self: boolean
}
interface LogBingo {
    discord_id: string,
    time: Date,
    type: 'bingo',
    text: null,
    url: null,
    name: string,
    image: string,
    self: boolean
}

export type Log = LogCheck | LogBingo;