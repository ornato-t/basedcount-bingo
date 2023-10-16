import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
    let id: string | null = null;

    if(browser){
        const stored = window.localStorage.getItem('bingo-id');

        if (data.cookie != null && data.cookie !== stored) {	    //Set id to cookie, refresh local storage
            id = data.cookie;
            window.localStorage.setItem('bingo-id', data.cookie);
        } else if (stored !== null) {								//Set id to local storage
            id = stored;
        }
    }

    return {
        id,
        users: data.users
    };
};