import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
    const DISCORD_ID = env.DISCORD_ID;

    return {
        discordId: DISCORD_ID
    };
};