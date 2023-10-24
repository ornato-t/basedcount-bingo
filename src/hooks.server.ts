import postgres from 'postgres'
import { PG_URI } from "$env/static/private";
import type { Handle } from '@sveltejs/kit';

const sql = postgres(PG_URI, {
    idle_timeout: 5,
    max_lifetime: 30,

});

export const handle: Handle = (async ({ event, resolve }) => {
    event.locals.sql = sql;

    return resolve(event)
});
