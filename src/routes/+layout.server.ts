import type { User } from '$lib/user';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
    const { sql } = locals;
    const users = await sql`
        SELECT discord_id, name, admin, image, banner, COUNT(round_number) as victories
        FROM discord_user
        LEFT JOIN discord_user_wins_round win
        ON discord_user.discord_id=win.discord_user_discord_id
        GROUP BY name, admin, image, banner, discord_id
        ORDER BY victories DESC      
    ` as User[];

    return {
        token: cookies.get('bingo-token'),
        users
    };
};