import { MongoClient } from "mongodb"
import { MONGODB_URI } from "$env/static/private";
import type { Handle } from '@sveltejs/kit';
import type User from "$lib/userType";

const client = new MongoClient(MONGODB_URI as string);
await client.connect();

export const handle: Handle = (async ({ event, resolve }) => {
    event.locals.users = client.db('bingo').collection<User>('users');

    return resolve(event)
});
