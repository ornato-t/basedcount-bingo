import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
    const data = await parent();

    if(data.token === undefined) throw redirect(303, '/');

    return data;
};