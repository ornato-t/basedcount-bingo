import { getLeaderboardAndRounds } from '$lib/leaderboard';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
    const { sql } = locals;

    const [leaderboard, rounds] = await getLeaderboardAndRounds(sql);

    return new Response(
        JSON.stringify({ leaderboard, rounds }),
        { headers: new Headers({ "Content-Type": 'application/json' }) }
    );
};