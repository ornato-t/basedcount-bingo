import { error, redirect } from '@sveltejs/kit';
import { bingoPlayerRole, serverId } from '$lib/discord';
import { DISCORD_TOKEN } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';
import type { DiscordMember, DiscordMemberFull } from '../play/add/+page.server';

export const load: PageServerLoad = async ({ parent }) => {
    const data = await parent();

    //Check if logged and if admin, if not redirect to home page
    if (data.currentUser == null || !data.currentUser.admin) throw redirect(308, '/');

    return {
        users: data.users,
        token: data.token,
    };
};

export const actions = {
    default: async ({ request, locals }) => {
        const { sql } = locals;
        
        const formData = await request.formData();
        const targetId = formData.get('id');
        if (targetId === null) return { failure: false };

        const users = await getServerUsers();
        const target = users.find(user => user.discord_id === targetId.toString());
        if (target === undefined) return { failure: false };

        const uuid = crypto.randomUUID();
        await sql`
            INSERT INTO discord_user
            VALUES(
                ${target.discord_id},
                ${target.name}, 
                false,
                ${target.image},
                null,
                ${uuid},
                false
            )
        `;
    },
} satisfies Actions;

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
    } satisfies DiscordMember));
}

function createLink(id: string, localHash: string | undefined, globalHash: string | undefined) {
    if (localHash) return `https://cdn.discordapp.com/guilds/${serverId}/users/${id}/avatars/${localHash}.webp`;
    if (globalHash) return `https://cdn.discordapp.com/avatars/${id}/${globalHash}.webp`

    return '/discord_green.png';   //Green default picture
}
