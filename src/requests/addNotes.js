import { addDoc, collection } from 'firebase/firestore';
import db from '../firebase';

export const addNotes = async (selectedTab, params) => {
  await addDoc(collection(db, selectedTab), {
    ...params,
    id: crypto.randomUUID(),
  });
}


