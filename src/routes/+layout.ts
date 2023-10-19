import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';
import type { User } from '$lib/user';
import type { LayoutLoad } from './$types';
import type { RequestInfo } from 'undici-types';

export const load: LayoutLoad = async ({ fetch, data }) => {
    return {
        token: data.token,
        users: data.users,
        currentUser: getCurrentUser(data.token, fetch)
    }
};

async function getCurrentUser(token: string | undefined, fetch: { (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> }) {
    if (!browser || !token) return null;

    let currentUser: User | null | { error: string } = null;
    
    const res = await fetch('/api/me', {
        headers: new Headers({ 'Authorization': `Bearer ${token}` }),
    });

    currentUser = await res.json() as User | { error: string };

    if ('error' in currentUser) throw error(res.status, { message: currentUser.error });

    return currentUser;
}