import { writable, type Writable } from 'svelte/store';

export const hideCard: Writable<boolean> = writable(false);
