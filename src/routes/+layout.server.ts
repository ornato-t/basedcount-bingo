import type { User } from '$lib/user';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
    const { sql } = locals;
    const token = cookies.get('bingo-token');

    const [users, currentUserDb] = await Promise.all([
        sql`
            SELECT discord_id, name, admin, image, banner, COUNT(round_number) as victories
            FROM discord_user
            LEFT JOIN discord_user_wins_round win
            ON discord_user.discord_id=win.discord_user_discord_id
            GROUP BY name, admin, image, banner, discord_id
            ORDER BY victories DESC      
        `,
        sql`
            SELECT name, admin, image, banner, COUNT(round_number) as victories
            FROM discord_user
            LEFT JOIN discord_user_wins_round win
            ON discord_user.discord_id=win.discord_user_discord_id
            WHERE token=${token ?? null}
            GROUP BY name, admin, image, banner
        `
    ]);

    let currentUser: User | null;
    if (currentUserDb.length === 0) {
        currentUser = null
    } else {
        currentUser = {
            admin: currentUserDb[0].admin,
            banner: currentUserDb[0].banner,
            discord_id: currentUserDb[0].discord_id,
            image: currentUserDb[0].image,
            name: currentUserDb[0].name,
            token: currentUserDb[0].token,
            victories: Number.parseInt(currentUserDb[0].victories)
        } satisfies User;
    }

    return {
        token,
        users,
        currentUser
    };
};