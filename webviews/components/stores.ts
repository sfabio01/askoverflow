import { writable } from 'svelte/store';

export const PAGE = {
    home: "home",
    ask: "ask",
};

export const screen = writable(PAGE.home);

// Home Page
export const searchResults = writable<Array<any>>([]);
export const query = writable("");
export const hasSearchedOnce = writable(false);

// Ask Page
export const title = writable("");
export const body = writable("");
export const tags = writable("");
export const isMounted = writable(false);
export const accessToken = writable("");