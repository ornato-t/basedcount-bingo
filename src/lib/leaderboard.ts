import type postgres from "postgres";

export async function getLeaderboardAndRounds(sql: postgres.Sql<Record<string, never>>) {
    const [leaderboardDb, roundsDb] = await sql`
        SELECT name, image, banner, COUNT(round_number) as victories, 
            DENSE_RANK() OVER (ORDER BY COUNT(round_number) DESC) as place
        FROM discord_user_wins_round w
        RIGHT JOIN discord_user u ON w.discord_user_discord_id=u.discord_id
        WHERE u.player = true
        GROUP BY name, image, banner
        HAVING COUNT(round_number) > 0
        ORDER BY victories DESC, name ASC;

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

    const leaderboardParsed = parseLeaderboard(leaderboardDb);
    const roundsParsed = parseRounds(roundsDb).reverse();

    return [leaderboardParsed, roundsParsed];
}

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
    }));
}

interface PlayerDB { name: string, image: string, banner: string | null, victories: string, place: string }
export interface Player { name: string, image: string, banner: string | null, victories: number, place: number }
interface Winner { name: string, image: string, banner: string | null }