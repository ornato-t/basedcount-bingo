import { getLeaderboardAndRounds } from '$lib/leaderboard';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals, depends }) => {
    const { sql } = locals;
    const data = await parent();

    depends('leaderboard');

    const [leaderboard, rounds] = await getLeaderboardAndRounds(sql);

    return {
        users: data.users,
        token: data.token,
        currentUser: data.currentUser,
        leaderboard,
        rounds
    };
};
