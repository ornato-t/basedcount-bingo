import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const DISCORD_ID = process.env.DISCORD_ID;

    return {
        discordId: DISCORD_ID
    };
};