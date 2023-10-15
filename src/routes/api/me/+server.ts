import type { RequestHandler } from "@sveltejs/kit";
import type postgres from "postgres";

export const GET: RequestHandler = async ({ locals, request }) => {
    const { sql } = locals;

    try {
        const auth = request.headers.get('Authorization');
        if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
            throw new Error("401");
        }

        const token = auth.slice(7);
        const res = await getUser(token, sql);

        return new Response(JSON.stringify(res));
    } catch (e) {
        if (e === "401")
            return new Response(JSON.stringify({ error: 'No authorization provided' }), { status: 400, statusText: 'Unauthorized' });
        if (e === "404")
            return new Response(JSON.stringify({ error: 'No matcing user found for provided id' }), { status: 404, statusText: 'Not found' });

        console.error(e);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, statusText: 'Internal server error' });
    }
}

async function getUser(token: string, sql: postgres.Sql<Record<string, never>>) {
    const res = await sql`
        SELECT name, admin, image, banner
        FROM discord_user
        WHERE token=${token}
        LIMIT 1
    `;

    if (res.length === 0) throw new Error("404");

    return res[0];
}