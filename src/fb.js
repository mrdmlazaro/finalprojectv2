import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase



const firebaseConfig = {
  apiKey: "AIzaSyDszRh2CnIX5klIuNPcKiM9Srap6ASoMm8",
  authDomain: "vue-project-25e03.firebaseapp.com",
  projectId: "vue-project-25e03",
  storageBucket: "vue-project-25e03.appspot.com",
  messagingSenderId: "828952327435",
  appId: "1:828952327435:web:f6d542151b2a4b51bc9e0e",
  measurementId: "G-KRLGS6TQWN"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

db.settings({ timestampsInSnapshots: true })
export default db;

export const createUser = user => {
  return usersCollection.add(user)
}

export const getUser = async id => {
  const user = await usersCollection.doc(id).get()
  return user.exists ? user.data() : null
}

export const updateUser = (id, user) => {
  return usersCollection.doc(id).update(user)
}

export const deleteUser = id => {
  return usersCollection.doc(id).delete()
}

export const useLoadUsers = () => {
  const users = ref([])
  const close = usersCollection.onSnapshot(snapshot => {
    users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
  onUnmounted(close)
  return users
}