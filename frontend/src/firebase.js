import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCyZQ_MOfTRVKszrTlyuq9c2yvLxoszzfE',
  authDomain: 'cibo-a0869.firebaseapp.com',
  projectId: 'cibo-a0869',
  storageBucket: 'cibo-a0869.firebasestorage.app',
  messagingSenderId: '29025198445',
  appId: '1:29025198445:web:bbb13df05e2e1e625aba64',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
