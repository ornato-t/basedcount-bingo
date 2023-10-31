import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const token = formData.get('token');

        if (token === null) return { failure: false };

        cookies.set('bingo-token', token.toString(), { path: '/', maxAge: 60 * 60 * 24 * 365 * 2 });   //Token expires in 2 years [seconds]

        throw redirect(308, '/play?/manual');
    },
} satisfies Actions;
