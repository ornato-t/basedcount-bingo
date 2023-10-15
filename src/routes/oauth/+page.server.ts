import type { PageServerLoad } from './$types';
import type { Collection } from 'mongodb';
import type { User } from '$lib/user';
import { env } from '$env/dynamic/private';
import { redirect, error as skError } from '@sveltejs/kit';
import { serverId, bingoPlayerRole, bingoMasterRole, adminRole } from '../../lib/discord';
import oauthUrl from '../../lib/oauthUrl';

export const load: PageServerLoad = async ({ url, locals, cookies }) => {
    const { users } = locals;

    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    if (error !== null && errorDescription !== null) throw skError(403, { message: errorDescription.replaceAll('+', ' '), });

    const token = await fetchToken(code);

    const profile = await fetchProfile(token);
    if (!isPlayer(profile)) {
        throw skError(403, { message: "You don't have the \"bingo player\" role, you can't play" })
    }

    const id = await upsertUser(profile, users);
    cookies.set('bingo-id', id, { path: '/' });

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
async function upsertUser(user: UserProfile, db: Collection<User>) {
    const res = await db.findOneAndUpdate(
        { discord_id: user.user.id },
        {
            $set: {
                discord_id: user.user.id,
                name: user.nick,
                admin: isAdmin(user),
                bio: user.bio,
                image: createLink(user.user.id, user.avatar ?? user.user.avatar, 'avatars'),
                banner: createLink(user.user.id, user.banner ?? user.user.banner, 'banners'),
            }
        },
        { upsert: true, returnDocument: 'after' }
    );

    if (res === null) throw skError(500, "Error while updating database");

    return res._id.toString();

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

function createLink(id: string, hash: string | undefined, endpoint: 'avatars' | 'banners') {
    if (hash == null && endpoint === 'avatars') return 'https://discord.com/assets/7c8f476123d28d103efe381543274c25.png';   //Green default picture
    else if (hash == null && endpoint === 'banners') return null;

    return `https://cdn.discordapp.com/${endpoint}/${id}/${hash}.webp`
}

interface UserProfile {
    avatar: string | undefined
    flags: number
    joined_at: string
    nick: string
    pending: boolean
    roles: string[]
    user: DiscordUser
    mute: boolean
    deaf: boolean
    bio: string
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
    global_name: string
    avatar_decoration_data: string | undefined
    banner_color: string
}
