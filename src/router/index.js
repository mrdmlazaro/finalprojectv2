import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Register from '../views/Register.vue'
import SignIn from '../views/SignIn.vue'
import Dashboard from '../views/Dashboard.vue'
import Quiz from '../views/Quiz.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'signIn',
      component: SignIn
    }, 
    {         
      path: '/register',
      name: 'register',
      component: Register
    },              
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta:{
        requiresAuth: true,
      },
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: Quiz,
      meta:{
        requiresAuth: true,
      },
    },
  ]
})
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject  
    );
  });
};
router.beforeEach(async(to,from,next)=>{
  if(to.matched.some((record)=> record.meta.requiresAuth)){
    if(await getCurrentUser()){
      next();
    } else {
      alert("you don't have access here!");
      next("/");
    }
  }else{
    next();
  }
});
export default router
