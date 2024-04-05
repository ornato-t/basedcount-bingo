import { DISCORD_TOKEN, SITE_URL } from "$env/static/private";
import { error } from "@sveltejs/kit";
import { bingoPlayerRole, serverId } from "./discordIds";
import type { User } from "./user";

//Return the list of images that have changed since the latest DB update
export async function refreshUserImages(users: User[]) {
    const updates = new Array<User>();
    const discordUsers = await getServerUsersAPI();

    for(const user of users){
        const discord = discordUsers.find(u => u.user.id === user.discord_id);
        if(!discord) continue;

        const avatar = createImageLink(user.discord_id, discord.avatar, discord.user.avatar, 'avatars');
        if(avatar !== user.image){
            updates.push(user);
            user.image = avatar;
        }
    }

    return updates;
}

//Create a global link to a discord image, either an avatar or a banner
export function createImageLink(id: string, localHash: string | undefined, globalHash: string | undefined, endpoint: 'avatars' | 'banners') {
    if (localHash) return `https://cdn.discordapp.com/guilds/${serverId}/users/${id}/${endpoint}/${localHash}.webp`;
    if (globalHash) return `https://cdn.discordapp.com/${endpoint}/${id}/${globalHash}.webp`

    if (globalHash == null && endpoint === 'avatars') return SITE_URL + '/discord_green.png';   //Green default picture

    return null;
}

//Poll a list of users from the Discord API and convert them to an internal format
export async function getServerUsers(): Promise<DiscordMember[]> {
    const users = await getServerUsersAPI();

    return users.map(member => ({
        name: member.nick ?? member.user.global_name ?? member.user.username,
        discord_id: member.user.id,
        image: createImageLink(member.user.id, member.avatar, member.user.avatar, 'avatars'),
        player: member.roles.includes(bingoPlayerRole)
    } satisfies DiscordMember)).sort((a, b) => {
        // Sort by player field first (players come first)
        if (a.player && !b.player) return -1;
        if (!a.player && b.player) return 1;

        // If both are players or both are non-players, sort alphabetically
        return a.name.localeCompare(b.name);
    });
}

//Poll a list of users from the Discord API
async function getServerUsersAPI(): Promise<DiscordMemberFull[]> {
    const res = await fetch(`https://discord.com/api/guilds/${serverId}/members?limit=1000`, {
        headers: new Headers({ 'Authorization': `Bot ${DISCORD_TOKEN}` }),
    });

    const users = await res.json() as DiscordMemberFull[] | { message: string, code: number };

    if ('message' in users) throw error(res.status, { message: users.message });

    return users;
}

interface DiscordMemberFull {
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

export interface DiscordMember {
    name: string,
    discord_id: string,
    image: string | null,
    player: boolean,
}

