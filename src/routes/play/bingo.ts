import type postgres from "postgres";
import { DISCORD_TOKEN } from "$env/static/private";
import { bingoChannelId, bingoPlayerRole } from "$lib/discord";

export async function checkBingo(sql: postgres.Sql<Record<string, never>>, token: string) {
    const checked = await sql`
        SELECT id,text,position,time,url
        FROM v_box_in_card
        WHERE checked=true AND token=${token}
        ORDER BY POSITION ASC
    ` as { id: number, text: string, position: number, time: Date, url: string }[];

    if (isBingo(checked.map(el => el.position))) {  //Is bingo
        const bingoInfo = await sql`
            SELECT c.bingo, u.discord_id, u.image, u.name
            FROM card c
            INNER JOIN discord_user u ON c.owner_discord_id=u.discord_id
            WHERE c.round_number = (SELECT MAX(id) FROM round) AND u.token=${token}
        ` as { bingo: boolean, discord_id: string, image: string, name: string }[];

        if (bingoInfo[0].bingo !== true) {   //If it wasn't bingo earlier on, save it as such
            await sql`
                UPDATE card
                SET bingo=TRUE
                WHERE round_number=(SELECT MAX(id) FROM round) AND owner_discord_id=(
                    SELECT discord_id
                    FROM discord_user
                    WHERE token=${token}
                )
            `;

            await sendDiscordAnnouncement(checked, bingoInfo[0].discord_id, bingoInfo[0].image, bingoInfo[0].name);
        }
    } else {    //Isn't bingo / is no longer bingo
        await sql`
            UPDATE card
            SET bingo=FALSE
            WHERE round_number=(SELECT MAX(id) FROM round) AND owner_discord_id=(
                SELECT discord_id
                FROM discord_user
                WHERE token=${token}
            )
        `;
        return false;
    }

    return true;
}

function isBingo(boxes: number[]) {
    const rows = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24]];
    const columns = [[1, 6, 11, 15, 20], [2, 7, 12, 16, 21], [3, 8, 17, 22], [4, 9, 13, 18, 23], [5, 10, 14, 19, 24]];
    const diagonals = [[1, 7, 18, 24], [5, 9, 16, 20]];

    for (const row of rows) {
        if (isLineComplete(row)) return true;
    }

    for (const column of columns) {
        if (isLineComplete(column)) return true;

    }

    for (const diagonal of diagonals) {
        if (isLineComplete(diagonal)) return true;

    }

    return false;

    function isLineComplete(line: number[]): boolean {
        return line.every(num => boxes.includes(num));
    }
}

async function sendDiscordAnnouncement(boxes: { id: number, text: string, position: number, time: Date, url: string }[], userId: string, image: string, name: string) {
    const gif = 'https://media.giphy.com/media/DFu7j1d1AQbaE/giphy.gif';
    
    await fetch(`https://discord.com/api/channels/${bingoChannelId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: `<@&${bingoPlayerRole}>`,
            embeds: [{
                author: {
                    name: `${name}`,
                    "icon_url": image
                },
                title: 'Bingo!',
                description:
                    `
                        <@${userId}> scored a bingo with the following boxes
                        ${boxes.map(
                        box => `- [${box.text}](${box.url})\n`)
                        .join('')
                    }
                    `,
                image: { url: gif }
            }]
        })
    });
}