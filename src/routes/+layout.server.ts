import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
    const { sql } = locals;
    const users = sql`
        SELECT name, admin, image, banner, discord_id
        FROM discord_user      
    `;

    return {
        cookie: cookies.get('bingo-id'),
        users
    };
};