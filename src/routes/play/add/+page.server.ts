import { bingoPlayerRole, serverId } from '$lib/discord';
import { DISCORD_TOKEN, SITE_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals }) => {
    const { sql } = locals;
    const data = await parent();

    const added = await sql`
        SELECT box.id as box_id, box.text as box_text, u.name as about_name, u.image as about_image, box.about_discord_id
        FROM box
        LEFT JOIN discord_user AS u ON box.about_discord_id=u.discord_id
        WHERE box.creator_discord_id = (
            SELECT discord_id
            FROM discord_user
            WHERE token=${data.token ?? null}
            LIMIT 1
        ) AND deleted != TRUE
    ` as { box_id: number, box_text: string, about_name: string, about_image: string, about_discord_id: string }[];

    const addedByOthers = await sql`
        SELECT b.about_discord_id as about_discord_id, ab.name as about_name, ab.image as about_image, cr.name as creator_name, cr.image as creator_image, b.id as box_id, 
            CASE WHEN ab.token = ${data.token ?? null} THEN NULL ELSE b.text END AS box_text
        FROM box b
        LEFT JOIN discord_user ab ON ab.discord_id=about_discord_id
        INNER JOIN discord_user cr ON cr.discord_id=creator_discord_id
        WHERE b.deleted = false AND cr.token != ${data.token ?? null}
        ORDER BY b.id ASC
    ` as { about_discord_id: string, about_name: string, about_image: string, creator_name: string, creator_image: string, box_id: number, box_text: string | null }[];

    return {
        users: data.users,
        token: data.token,
        added,
        addedByOthers,
        userList: await getServerUsers()
    };
};

async function getServerUsers(): Promise<DiscordMember[]> {
    const res = await fetch(`https://discord.com/api/guilds/${serverId}/members?limit=1000`, {
        headers: new Headers({ 'Authorization': `Bot ${DISCORD_TOKEN}` }),
    });

    const users = await res.json() as DiscordMemberFull[] | { message: string, code: number };

    if ('message' in users) throw error(res.status, { message: users.message });

    return users.map(member => ({
        name: member.nick ?? member.user.global_name ?? member.user.username,
        discord_id: member.user.id,
        image: createLink(member.user.id, member.avatar, member.user.avatar),
        player: member.roles.includes(bingoPlayerRole)
    } satisfies DiscordMember)).sort((a, b) => {
        // Sort by player field first (players come first)
        if (a.player && !b.player) return -1;
        if (!a.player && b.player) return 1;

        // If both are players or both are non-players, sort alphabetically
        return a.name.localeCompare(b.name);
    });
}

function createLink(id: string, localHash: string | undefined, globalHash: string | undefined) {
    if (localHash) return `https://cdn.discordapp.com/guilds/${serverId}/users/${id}/avatars/${localHash}.webp`;
    if (globalHash) return `https://cdn.discordapp.com/avatars/${id}/${globalHash}.webp`

    return SITE_URL + '/discord_green.png';   //Green default picture
}

export const actions = {
    add: async ({ request, locals }) => {
        const { sql } = locals;

        const formData = await request.formData();
        const text = formData.get('text');
        const token = formData.get('token');
        const target = formData.get('target') ?? { toString: () => null };

        if (text === null || token === null) return { failure: true }

        let targetStr = target.toString();
        if (targetStr === 'undefined') targetStr = null;

        await sql`
            INSERT INTO box(text,creator_discord_id,about_discord_id)
            VALUES (
                ${text.toString()},
                (
                    SELECT discord_id
                    FROM discord_user
                    WHERE token=${token.toString()}
                    LIMIT 1
                ) , 
                ${targetStr}
            )
        `;

        return { success: true }
    },
    delete: async ({ request, locals }) => {
        const { sql } = locals;

        const formData = await request.formData();
        const boxId = (formData.get('box') ?? { toString: () => null }).toString();
        const token = (formData.get('token') ?? { toString: () => null }).toString();

        await sql`
            UPDATE box
            SET deleted = TRUE 
            WHERE id IN (
                SELECT b.id 
                FROM box b
                INNER JOIN discord_user u ON b.creator_discord_id = u.discord_id
                WHERE b.id = ${boxId} AND u.token = ${token}
            )        
        `;

        return { success: true }
    }
} satisfies Actions;

export interface DiscordMember {
    name: string,
    discord_id: string,
    image: string | null,
    player: boolean,
}

export interface DiscordMemberFull {
    avatar: string
    flags: number
    joined_at: string
    nick: string | null
    roles: string[]
    user: DiscordUser
}

interface DiscordUser {
    id: string
    username: string
    avatar: string
    discriminator: string
    public_flags: number
    flags: number
    banner: string | null
    global_name: string
}
