import { writable } from 'svelte/store';

export const selectedTab = writable(9);
export const listNotes = writable({});
export const searchValue = writable('');
