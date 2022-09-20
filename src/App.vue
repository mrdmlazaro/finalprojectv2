<template>
   <v-app>
    <v-main>
       <Navbar/>
       <router-view></router-view>
    </v-main>
   </v-app>
</template>
<style>
   @font-face {
      font-family: "Gotham Bold";
      src: local("Gotham"),
         url(./fonts/Gotham/GothamBold.ttf) format("truetype");
   }
   @font-face {
      font-family: "Gotham Medium";
      src: local("Gotham"),
         url(./fonts/Gotham/GothamMedium.ttf) format("truetype");
   }
   </style>
<script setup>
  import Navbar from '@/components/NavBar.vue';
</script>
