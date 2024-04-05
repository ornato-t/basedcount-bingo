import postgres from 'postgres'
import { PG_URI } from "$env/static/private";
import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

const sql = postgres(PG_URI, {
    idle_timeout: 10,
    max_lifetime: 30,
    max: 10
});

export const handle: Handle = (async ({ event, resolve }) => {
    if(!dev) {
        const ip = event.request.headers.get('x-forwarded-for');
        console.log(`Request from IP: ${ip}`);
    }
    
    event.locals.sql = sql;

    return resolve(event)
});
