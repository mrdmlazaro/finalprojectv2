import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDszRh2CnIX5klIuNPcKiM9Srap6ASoMm8",
  authDomain: "vue-project-25e03.firebaseapp.com",
  projectId: "vue-project-25e03",
  storageBucket: "vue-project-25e03.appspot.com",
  messagingSenderId: "828952327435",
  appId: "1:828952327435:web:f6d542151b2a4b51bc9e0e",
  measurementId: "G-KRLGS6TQWN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export{
  db
}

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
