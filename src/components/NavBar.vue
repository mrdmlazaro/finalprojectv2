<template>
  <nav v-if="isLoggedIn">
    <v-toolbar color="#87CEEB" app>
      <v-app-bar-nav-icon color="white" @click='toggleDrawer'></v-app-bar-nav-icon>
      <v-toolbar-title>
        <span class="title-lab">LAZARO PROJECT</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- dropdown menu -->

      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn class="menu" color="primary" v-bind="props">
            SELECTION
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" router :to="item.path" :prepend-icon="item.icon">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn color="error" @click="handleSignOut" v-if="isLoggedIn">
        Sign Out
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer class="nav-drawer" color="#5485b4" app v-model="drawer">
      <v-list-item class="list-item" color="white" v-for="item in items" :key="item.title" router :to="item.path"
        :prepend-icon="item.icon">
        <v-list-item-title color="white">{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import vuetify from '../plugins/vuetify';
import { onMounted } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter } from 'vue-router';
const router = useRouter();
const drawer = ref(false)

const items = ref([
  { title: 'About', icon: 'mdi-account', path: '/dashboard' },
  { title: 'Quiz', icon: 'mdi-note-outline', path: '/quiz' },
])

function toggleDrawer() {
  return drawer.value = !drawer.value
}
const isLoggedIn = ref(false);
let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
});
const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/");
  });
};
</script>

<style scoped>
.menu {
  color: white;
  font-family: "Gotham Bold", Helvetica, Arial;
}

.title-lab {
  color: white;
  font-family: "Gotham Bold", Helvetica, Arial;
}

.list-item {
  font-family: "Gotham Bold", Helvetica, Arial;
}

.nav-drawer {
  background-color: aqua;
}
</style>