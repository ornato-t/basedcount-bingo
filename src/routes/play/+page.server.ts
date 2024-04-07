import type { Actions, PageServerLoad } from './$types';
import type { Box } from '$lib/bingo';
import type postgres from 'postgres';
import { checkBingo } from './bingo';
import { sendBoxAnnouncement, sendBoxUncheckAnnouncement, sendForcedNewRoundAnnouncement, sendContestation, sendNewRoundAnnouncement } from './discord';
import type { User } from '$lib/user';
import type { Log, LogContestation } from '$lib/log';
import { getRelativeDate, isFinished } from './forcedNewRound';
import { refreshUserImages } from '$lib/discordAPI';

export const load: PageServerLoad = async ({ parent, locals, depends }) => {
    const { sql } = locals;
    const data = await parent();

    depends('play');

    const [ownCard, logBase, logContestation, round] = await Promise.all([
        //Pulls the most recent card for the user with the provided token
        sql`
            SELECT v.id, v.text, v.checked, v.about_discord_id, v.checked, u.image as about_image, u.name as about_name
            FROM v_box_in_card v
            LEFT JOIN discord_user u ON v.about_discord_id=u.discord_id
            WHERE v.token=${data.token ?? ''}
            ORDER BY position ASC;
        ` as Promise<BoxCheckable[]>,
        //Pull bingo and box checking log
        sql`
            WITH union_query AS (
                    SELECT owner_discord_id AS discord_id, bingo_time AS time, 'bingo' as type, null as text, null as url, round_number as round, -1 as box_id
                    FROM card
                    WHERE bingo=true
                UNION
                    SELECT discord_user_discord_id AS discord_id, time AS time, 'check' as type, b.text, c.url, card_round_number as round, c.box_id as box_id
                    FROM checks c
                    INNER JOIN box b ON c.box_id=b.id
            )
            SELECT uq.discord_id, uq.time, uq.type, uq.text, uq.url, u.discord_id, u.name, u.image,  uq.box_id,
                CASE WHEN u.token = ${data.token ?? ''} THEN true ELSE false END AS self
            FROM union_query uq
            INNER JOIN discord_user u ON uq.discord_id=u.discord_id
            WHERE uq.round=(SELECT MAX(id) FROM round);
        ` as Promise<Log[]>,
        //Pull contestation log with appropriate side data
        sql`
            SELECT
                c.contester_discord_id as discord_id, c.time, 'contestation' as type, b.text, ch.url, uco.name, uco.image, c.box_id, c.reason,
                CASE WHEN uco.token = ${data.token ?? ''} THEN true ELSE false END AS self,
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
            GROUP BY c.contester_discord_id, c.time, b.text, ch.url, uco.name, uco.image, c.box_id, c.reason,
                uco.token,
                c.box_id, c.checker_discord_id, uch.name, uch.image,
                c.card_owner_discord_id, c.card_round_number;
        ` as Promise<LogContestation[]>,
        //Pull info about the current round
        sql`
            SELECT id as number, start_time
            FROM round
            ORDER BY number DESC
            LIMIT 1;
        ` as Promise<{ number: number, start_time: Date }[]>
    ]);

    const log = [...logBase, ...logContestation].sort((a, b) => a.time.valueOf() - b.time.valueOf());   //Merge the two log arrays and sort by date
    ownCard.splice(12, 0, { about_discord_id: null, id: NaN, text: 'image://kekw.png', creator_discord_id: '', checked: true });

    return {
        users: data.users,
        token: data.token,
        cards: ownCard,
        round: round[0],
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

        const [checkedBoxes, box, user] = await Promise.all([
            sql`
                SELECT DISTINCT id
                FROM v_box_in_card
                WHERE checked=true
            ` as Promise<{ id: number }[]>,
            sql`
                SELECT *
                FROM box
                WHERE id=${boxIdStr}
            `.then(user => user[0]) as Promise<Box>,
            sql`
                SELECT *
                FROM discord_user
                WHERE token=${tokenStr}
            `.then(user => user[0]) as Promise<User>,
            sql`
                INSERT INTO checks (discord_user_discord_id, box_id, card_owner_discord_id, card_round_number, time, url)
                SELECT discord_id, ${boxIdStr}, discord_id, (SELECT MAX(id) FROM round), NOW(), ${urlStr}
                FROM discord_user
                WHERE token=${tokenStr}
            `,
        ]);

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

        const deleted = await sql`
            WITH deleted AS (
                DELETE FROM checks 
                WHERE discord_user_discord_id IN (
                SELECT u.discord_id
                FROM discord_user u
                WHERE u.token= ${tokenStr}
                )
                AND box_id=${boxIdStr}
                AND card_round_number=(SELECT MAX(id) FROM round)
                RETURNING *
            )
            SELECT u.discord_id AS discord_id, b.text AS box_text, d.url AS url, u.image AS user_image, u.name AS user_name
            FROM deleted d
            INNER JOIN discord_user u ON d.discord_user_discord_id=u.discord_id
            INNER JOIN box b ON d.box_id=b.id;
        ` as { discord_id: string, box_text: string, url: string, user_image: string, user_name: string }[];

        if (deleted.length > 0) {
            await sendBoxUncheckAnnouncement(deleted[0].box_text, deleted[0].url, deleted[0].discord_id, deleted[0].user_image, deleted[0].user_name);
        }

        await checkBingo(sql, tokenStr);

        return { success: true };
    },
    startNewRound: async ({ request, locals }) => {
        const { sql } = locals;

        const formData = await request.formData();
        const token = formData.get('token') ?? null;
        const winners = formData.get('winners') ?? { toString: () => '' };

        const { admin_discord_id, admin_name, admin_image, admin } = (await sql`
            SELECT discord_id as admin_discord_id, name as admin_name, image as admin_image, admin
            FROM discord_user
            WHERE token=${token === null ? null : token.toString()}
            LIMIT 1
        `)[0] as { admin_discord_id: string, admin_name: string, admin_image: string, admin: boolean };

        if (!admin) return { failure: true };

        const winnersStr = winners.toString();
        const winnersArr = new Array<string>;
        if (winnersStr !== '') {
            for (const winner of winnersStr.split(';')) {
                winnersArr.push(winner);
                //Add win only if user already has a bingo
                await sql`
                    WITH winner_check AS (
                        SELECT bingo
                        FROM card
                        WHERE owner_discord_id = ${winner} AND bingo = TRUE
                        ORDER BY round_number DESC
                        LIMIT 1
                    )
                    INSERT INTO discord_user_wins_round (discord_user_discord_id, round_number)
                    SELECT ${winner}, (SELECT MAX(id) FROM round)
                    WHERE EXISTS (SELECT 1 FROM winner_check WHERE bingo = TRUE);
                `
            }
        }

        await sendNewRoundAnnouncement(admin_discord_id, admin_name, admin_image, winnersArr);
        await refreshDatabaseImages(sql);
        await startRound(sql);

        return { success: true };
    },
    forceNewRound: async ({ locals }) => {
        const { sql } = locals;

        const round = (await sql`
            SELECT id as number, start_time
            FROM round
            ORDER BY number DESC
            LIMIT 1;
        `)[0] as { number: number, start_time: Date };
        console.log('Forcing', round)

        if (!isFinished(getRelativeDate(round.start_time))) return { failure: true }

        await sendForcedNewRoundAnnouncement();
        await startRound(sql);

        return { success: true };
    },
    contest: async ({ request, locals }) => {
        const { sql } = locals;

        const formData = await request.formData();
        const token = formData.get('token');
        const boxId = formData.get('box');
        const reason = formData.get('reason');
        const checkerDiscordId = formData.get('checker');
        const url = formData.get('url');

        if (token === null || boxId === null || reason === null || checkerDiscordId === null || url === null) return { failure: true };

        const tokenStr = token.toString();
        const boxIdStr = boxId.toString();
        const reasonStr = reason.toString();
        const checkerDiscordIdStr = checkerDiscordId.toString();
        const urlStr = url.toString();

        if (reasonStr.length === 0) return { failure: true };

        const [box, contester, checker] = await Promise.all([
            sql`
                SELECT *
                FROM box
                WHERE id=${boxIdStr}
            `.then(box => box[0]) as Promise<Box>,
            sql`
                SELECT *
                FROM discord_user
                WHERE token=${tokenStr}
            `.then(user => user[0]) as Promise<User>,
            sql`
                SELECT *
                FROM discord_user
                WHERE discord_id=${checkerDiscordIdStr}
            `.then(user => user[0]) as Promise<User>,
        ]);

        await Promise.all([
            sql`
                INSERT INTO contestation(contester_discord_id, checker_discord_id, box_id, card_owner_discord_id, card_round_number, reason, time)
                VALUES(${contester.discord_id}, ${checker.discord_id}, ${box.id}, ${checker.discord_id}, (SELECT MAX(id) FROM round), ${reasonStr}, NOW())          
            `,
            sql`
                INSERT INTO contestation_vote(contester_discord_id, checker_discord_id, box_id, card_owner_discord_id, card_round_number, voter_discord_id, vote)
                VALUES
                    (${contester.discord_id}, ${checker.discord_id}, ${box.id}, ${checker.discord_id}, (SELECT MAX(id) FROM round), ${contester.discord_id}, TRUE),    
                    (${contester.discord_id}, ${checker.discord_id}, ${box.id}, ${checker.discord_id}, (SELECT MAX(id) FROM round), ${checker.discord_id}, FALSE),
            `,
        ]);

        await sendContestation(box, checker, contester, urlStr, reasonStr);

        return { success: true };
    },
    contestVote: async () => {
        //TODO
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

async function refreshDatabaseImages(sql: postgres.Sql<Record<string, never>>) {
    const users = await sql`
        SELECT discord_id, image, banner, player
        FROM discord_user
        LEFT JOIN discord_user_wins_round win
        ON discord_user.discord_id=win.discord_user_discord_id
        GROUP BY discord_id, name, image, banner
    ` as User[];

    const updates = await refreshUserImages(users);

    for (const user of updates) {
        await sql`
            UPDATE discord_user
            SET image=${user.image}
            WHERE discord_id=${user.discord_id}
        `
    }
}

export interface BoxCheckable extends Box {
    checked: boolean;
    about_image?: string;
    about_name?: string;
}
