import { getDocs, collection } from 'firebase/firestore';
	import db from '../firebase';

export const requestNotes = async (path) => {
  const list = []
  const querySnapshot = await getDocs(collection(db, path));
  querySnapshot.forEach((doc) => {
    list.push({ id: doc.id, ...doc.data() });
  });

  return list
}
