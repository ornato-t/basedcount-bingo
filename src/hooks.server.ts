import postgres from 'postgres'
import { PG_URI } from "$env/static/private";
import type { Handle } from '@sveltejs/kit';

const sql = postgres(PG_URI, {
    idle_timeout: 5,
    max_lifetime: 10,    //Play page refreshes every 10 seconds

});

export const handle: Handle = (async ({ event, resolve }) => {
    const ip = [event.request.headers.get('x-forwarded-for'), event.request.headers.get('x-real-ip')];
    console.log(`Request from IP: [${ip}]`);
    
    event.locals.sql = sql;

    return resolve(event)
});
