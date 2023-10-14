import type { PageServerLoad } from './$types';
// import { env } from '$env/dynamic/private';
import { error as skError } from '@sveltejs/kit';
import oauthUrl from '../../lib/oauthUrl';

export const load: PageServerLoad = async ({ url }) => {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');


    if (error !== null && errorDescription !== null) throw skError(403, { message: errorDescription.replaceAll('+', ' '), });

    // const DISCORD_SECRET = env.DISCORD_SECRET;

    const res = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: JSON.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: oauthUrl
        })
    });

    

    return {
        res: res.json(),
        status: res.status,
        statusTest: res.statusText
    };
};