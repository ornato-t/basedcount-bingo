import type { User } from "$lib/user";
import type { RequestHandler } from "@sveltejs/kit";
import type postgres from "postgres";

export const GET: RequestHandler = async ({ locals, request }) => {
    const { sql } = locals;

    try {
        const auth = request.headers.get('Authorization');
        if (!auth || !auth.toLowerCase().startsWith('bearer ') || auth.toLocaleLowerCase() === 'bearer undefined') {
            throw new Error("401");
        }

        const token = auth.slice(7);
        const res = await getUser(token, sql);

        return new Response(JSON.stringify(res));
    } catch (e) {
        if (e === "401")
            return new Response(JSON.stringify({ error: 'No authorization provided' }), { status: 400, statusText: 'Unauthorized' });
        if (e === "404")
            return new Response(JSON.stringify({ error: 'No matcing user found for provided token' }), { status: 404, statusText: 'Not found' });

        console.error(e);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, statusText: 'Internal server error' });
    }
}

async function getUser(token: string, sql: postgres.Sql<Record<string, never>>) {
    const res = await sql`
        SELECT name, admin, image, banner, COUNT(round_number) as victories
        FROM discord_user
        LEFT JOIN discord_user_wins_round win
        ON discord_user.discord_id=win.discord_user_discord_id
        WHERE token=${token}
        GROUP BY name, admin, image, banner
    `;

    if (res.length === 0) throw new Error("404");
    
    const returned = {
        admin: res[0].admin,
        banner: res[0].banner,
        discord_id: res[0].discord_id,
        image: res[0].image,
        name: res[0].name,
        token: res[0].token,
        victories: Number.parseInt(res[0].victories)
    } satisfies User;

    return returned;
}