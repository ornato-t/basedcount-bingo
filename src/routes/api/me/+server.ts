import type User from "$lib/userType";
import type { RequestHandler } from "@sveltejs/kit";
import { ObjectId, type Collection } from "mongodb";

export const GET: RequestHandler = async ({ locals, request }) => {
    const { users } = locals;

    try {
        const auth = request.headers.get('Authorization');
        if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
            throw new Error("401");
        }

        const id = auth.slice(7);

        const res = await getUser(id, users);

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

async function getUser(id: string, db: Collection<User>) {
    const res = await db.findOne({ _id: new ObjectId(id) }, { projection: { _id: 0 } });

    if (res === null) throw new Error("404");

    return res;
}