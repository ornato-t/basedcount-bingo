import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
    const data = await parent();

    if(data.token === undefined || data.currentUser === null) throw redirect(303, '/'); //TODO: if no user redirect to logout instead

    return data;
};