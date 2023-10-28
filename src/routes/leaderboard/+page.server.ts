import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals, depends }) => {
    const { sql } = locals;
    const data = await parent();

    depends('leaderboard');

    const [leaderboard, rounds] = await sql`
        SELECT name, image, banner, COUNT(round_number) as victories, ARRAY_AGG(round_number) as rounds, 
            DENSE_RANK() OVER (ORDER BY COUNT(round_number) DESC) as place
        FROM discord_user_wins_round w
        RIGHT JOIN discord_user u ON w.discord_user_discord_id=u.discord_id
        GROUP BY name, image, banner
        ORDER BY victories DESC;

        SELECT r.id as round_number, ARRAY_AGG((name, image, banner)) as winners
        FROM discord_user_wins_round w
        INNER JOIN discord_user u ON w.discord_user_discord_id=u.discord_id
        RIGHT JOIN round r ON r.id=w.round_number
        GROUP BY r.id
        ORDER BY round_number ASC;
    `
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .simple() as [PlayerDB[], { round_number: number, winners: string }[]];

    return {
        users: data.users,
        token: data.token,
        currentUser: data.currentUser,
        leaderboard: parseLeaderboard(leaderboard),
        rounds: parseRounds(rounds)
    };
};

function parseRounds(rounds: { round_number: number, winners: string }[]) {
    const regex = /"\(([^,]+),([^,]+),([^,]+)?\)"/g;
    const nameRegex = /\\"(.+)\\"/;

    const returned = rounds.map(round => ({
        round_number: round.round_number,
        winners: parseWinners(round.winners)
    })) satisfies { round_number: number, winners: Winner[] }[];

    return returned;

    function parseWinners(winners: string): Winner[] {
        const tuples = new Array<Winner>();

        let match;
        while ((match = regex.exec(winners)) !== null) {
            let name = match[1];
            
            const nameMatch = nameRegex.exec(name);
            if (nameMatch) {
                name = nameMatch[1];
            }

            tuples.push({
                name: name,
                image: match[2],
                banner: match[3] || null
            });
        }

        return tuples;
    }
}

function parseLeaderboard(leaderboard: PlayerDB[]): Player[] {
    return leaderboard.map(player => ({
        banner: player.banner,
        image: player.image,
        name: player.name,
        place: Number.parseInt(player.place),
        victories: Number.parseInt(player.victories),
        rounds: Number.isNaN(player.rounds[0]) ? [] : player.rounds,
    }));
}

interface PlayerDB { name: string, image: string, banner: string | null, victories: string, rounds: number[], place: string }
export interface Player { name: string, image: string, banner: string | null, victories: number, rounds: number[], place: number }
interface Winner { name: string, image: string, banner: string | null }