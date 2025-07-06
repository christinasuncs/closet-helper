<template>   
    <v-app-bar app>     
        <v-toolbar-title class="d-flex align-center">       
            <!-- <v-btn icon to="/">         
                <v-icon>mdi-home</v-icon>       
            </v-btn>        -->
            <span class="ml-3">Outfit Generator</span>     
        </v-toolbar-title>     
        <v-spacer></v-spacer>     
        <v-tabs v-model="activeTab" background-color="primary">       
            <v-tab to="/">Home</v-tab>       
            <v-tab to="/outfits">Outfits</v-tab>     
            <v-tab to="/closet">Closet</v-tab>     
            <v-tab v-if="!loggedIn" to="/login">Log In</v-tab>     
            <v-tab v-else @click.prevent="logout">Log Out</v-tab>     
        </v-tabs>   
    </v-app-bar> 
</template> 
<script>
import axios from 'axios';
export default {
  props: {
    loggedIn: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['logout'],
  data() {
    return {
      activeTab: this.$route.path,
    };
  },
  watch: {
    $route(to) {
      this.activeTab = to.path;
    },
  },
  methods: {
    logout() {
      this.$emit('logout');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.v-app-bar {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>