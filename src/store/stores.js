import { writable } from 'svelte/store';

export const selectedTab = writable(9);
export const listNotes = writable({});
export const searchValue = writable('');
export const loadPage = writable(false);
export const groupCollection = writable([]);
export const typeCollection = writable([]);
