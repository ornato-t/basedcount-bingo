import type { PageServerLoad } from './$types';
import type postgres from 'postgres';
import { env } from '$env/dynamic/private';
import { redirect, error as skError } from '@sveltejs/kit';
import { serverId, bingoPlayerRole, bingoMasterRole, adminRole } from '../../lib/discord';
import oauthUrl from '../../lib/oauthUrl';

export const load: PageServerLoad = async ({ url, locals, cookies }) => {
    const { sql } = locals;

    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    if (error !== null && errorDescription !== null) throw skError(403, { message: errorDescription.replaceAll('+', ' '), });

    const discordToken = await fetchToken(code);

    const profile = await fetchProfile(discordToken);
    if (!isPlayer(profile)) {
        throw skError(403, { message: "You don't have the \"bingo player\" role, you can't play" })
    }

    const token = await upsertUser(profile, sql);
    cookies.set('bingo-token', token, { path: '/', maxAge: 60 * 60 * 24 * 365 * 2 });   //Token expires in 2 years [seconds]

    throw redirect(308, '/play');
};

async function fetchToken(code: string | null) {
    const DISCORD_ID = env.DISCORD_ID;
    const DISCORD_SECRET = env.DISCORD_SECRET;

    try {
        const res = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                'grant_type': 'authorization_code',
                'code': code ?? '',
                'redirect_uri': oauthUrl
            }),
            headers: new Headers({
                'Authorization': 'Basic ' + btoa(`${DISCORD_ID}:${DISCORD_SECRET}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
        });

        const json = await res.json() as { error: string } | { access_token: string, token_type: "Bearer", expires_in: number, refresh_token: string, scope: string };
        if ('error' in json)
            throw skError(res.status, { message: json.error });
        else if (!res.ok)
            throw skError(res.status, { message: 'Unknown error' });

        return json.access_token;

    } catch (e) {
        throw skError(500, { message: "Error during OAuth2 token exchange: " + e });
    }
}

async function fetchProfile(token: string) {
    const url = `https://discord.com/api/users/@me/guilds/${serverId}/member`;

    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }),
    })

    return res.json() as Promise<UserProfile>;
}

//Inserts or refreshes a user's Discord data in the database. Non updated data remains unchanged.
async function upsertUser(user: UserProfile, sql: postgres.Sql<Record<string, never>>) {
    const uuid = crypto.randomUUID();

    await sql`
        INSERT INTO discord_user
        VALUES(
            ${user.user.id},
            ${user.nick ?? user.user.global_name ?? user.user.username}, 
            ${isAdmin(user)},
            ${createLink(user.user.id, user.avatar, user.user.avatar, 'avatars')},
            ${createLink(user.user.id, user.banner, user.user.banner, 'banners')},
            ${uuid}
        )
        ON CONFLICT (discord_id) DO UPDATE SET 
        name = EXCLUDED.name,
        admin = EXCLUDED.admin,
        image = EXCLUDED.image,
        banner = EXCLUDED.banner,
        token = EXCLUDED.token
    `;

    return uuid;

}

function isAdmin(user: UserProfile) {
    if (user.roles.includes(adminRole) || user.roles.includes(bingoMasterRole))
        return true;
    return false;
}

function isPlayer(user: UserProfile) {
    if (user.roles.includes(bingoPlayerRole))
        return true;
    return false;
}

function createLink(id: string, localHash: string | undefined, globalHash: string | undefined, endpoint: 'avatars' | 'banners') {
    if (localHash) return `https://cdn.discordapp.com/guilds/${serverId}/users/${id}/${endpoint}/${localHash}.webp`;
    if (globalHash) return `https://cdn.discordapp.com/${endpoint}/${id}/${globalHash}.webp`

    if (globalHash == null && endpoint === 'avatars') return '/discord_green.png';   //Green default picture

    return null;
}

interface UserProfile {
    avatar: string | undefined
    flags: number
    joined_at: string
    nick: string | undefined
    pending: boolean
    roles: string[]
    user: DiscordUser
    mute: boolean
    deaf: boolean
    bio: string | undefined
    banner: string | undefined
}

interface DiscordUser {
    id: string
    username: string
    avatar: string | undefined
    discriminator: string
    public_flags: number
    flags: number
    banner: string | undefined
    accent_color: number
    global_name: string | undefined
    avatar_decoration_data: string | undefined
    banner_color: string
}
