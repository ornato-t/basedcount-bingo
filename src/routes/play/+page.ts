import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch }) => {
    const parentComp = await parent();
    console.log(parentComp)
    const id = parentComp.id;

    const res = await fetch('/api/me', {
        headers: new Headers({ 'Authorization': `Bearer ${id}` }),
    });

    const json = await res.json();

    if (!res.ok) throw error(res.status, { message: await json.error });

    return {
        profile: json
    };
};