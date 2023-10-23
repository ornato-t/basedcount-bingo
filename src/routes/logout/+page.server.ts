import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
    cookies.delete('bingo-token');
    throw redirect(308, '/');
};
