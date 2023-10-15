// import type { User } from "$lib/user";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
    const { sql } = locals;

    try {
        const res = await sql`
            select name, admin, image, banner
            from discord_user
            
        `;

        if (res.length === 0) throw new Error('404');

        return new Response(JSON.stringify(res));
    } catch (e) {
        if (e === '404') return new Response(JSON.stringify({ error: 'No users found' }), { status: 404, statusText: 'Not found' });

        console.error(e);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, statusText: 'Internal server error' });
    }
}
