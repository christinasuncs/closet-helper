<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
  import Navbar from './components/Navbar.vue';
  import OutfitGenerator from './components/OutfitGenerator.vue';
  export default{
    name: 'App',
    components: {
      OutfitGenerator,
      Navbar
    },
  }
</script>