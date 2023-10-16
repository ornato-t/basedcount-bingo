import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
    let token: string | null = null;

    if(browser){
        const stored = window.localStorage.getItem('bingo-token');

        if (data.cookie != null && data.cookie !== stored) {	    //Set token to cookie, refresh local storage
            token = data.cookie;
            window.localStorage.setItem('bingo-token', data.cookie);
        } else if (stored !== null) {								//Set token to local storage
            token = stored;
        }
    }

    return {
        token,
        users: data.users
    };
};