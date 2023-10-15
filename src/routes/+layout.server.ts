import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    return {
        cookie: cookies.get('bingo-id')
    };
};