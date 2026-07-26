// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg44fg5z0x7Pkop_xvBcx77t0k72SZVj8",
  authDomain: "cortexai-609a4.firebaseapp.com",
  projectId: "cortexai-609a4",
  storageBucket: "cortexai-609a4.firebasestorage.app",
  messagingSenderId: "1074635863264",
  appId: "1:1074635863264:web:fe28c13e824adfedae4c85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth=getAuth(app)
export const googleProvider=new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})