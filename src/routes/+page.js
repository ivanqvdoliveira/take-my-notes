import { selectedTab, listNotes } from '../store/stores.js';
import { notesMock } from '../mocks/notesMock.js';

export const load = async () => {
  let selectedTabValue;
  const unsubscribe = selectedTab.subscribe(value => {
    selectedTabValue = value;
  });
  unsubscribe();

  const list = notesMock.find(elem => elem.id === selectedTabValue);

  if (list) {
    listNotes.set(list);
  } else {
    console.error('Nenhum elemento encontrado');
  }
}

export const prerender = true;
