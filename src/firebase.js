import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDUTcE4AwZ1Z9yAFQqS-XewXMJ41PDkOfQ',
  authDomain: 'take-my-notes-43bd4.firebaseapp.com',
  projectId: 'take-my-notes-43bd4',
  storageBucket: 'take-my-notes-43bd4.appspot.com',
  messagingSenderId: '1047054175881',
  appId: '1:1047054175881:web:35ce9f4ef46d840e7e8058',
  measurementId: 'G-QZFXYZ4EC8',
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
