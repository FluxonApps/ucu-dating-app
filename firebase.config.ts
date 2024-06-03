import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBQTV7Efv9d_EECXxJQcc-T_lvy9Jam6HI',
  authDomain: 'ucu-dating-app.firebaseapp.com',
  projectId: 'ucu-dating-app',
  storageBucket: 'ucu-dating-app.appspot.com',
  messagingSenderId: '575711991875',
  appId: '1:575711991875:web:16a0571f2ce24285badcf6'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
