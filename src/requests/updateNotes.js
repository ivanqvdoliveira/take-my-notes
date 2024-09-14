import { doc, updateDoc } from 'firebase/firestore';
import db from '../firebase';

export const updateNotes = async (selectedTab, params) => {
  const docRef = doc(db, selectedTab, params.docId);

   await updateDoc(docRef, {
    ...params
  });
}
