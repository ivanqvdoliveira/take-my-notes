import { addDoc, collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import db from '../firebase';

export const addNotes = async (selectedTab, params) => {
  const noteId = uuidv4();
  await addDoc(collection(db, selectedTab), {
    ...params,
    id: noteId,
  });
}


