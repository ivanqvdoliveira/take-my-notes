import { doc, deleteDoc } from 'firebase/firestore';
import db from '../firebase';

export const deleteNote = async (selectedTab, docId) => {
  const docRef = doc(db, selectedTab, docId);

   await deleteDoc(docRef);
}
