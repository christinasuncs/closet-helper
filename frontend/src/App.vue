<template>
  <v-app>
    <Navbar :logged-in="loggedIn" @logout="handleLogout" />
    <v-main>
      <router-view v-slot="{ Component }">
        <component :is="Component" @login-success="handleLoginSuccess" />
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
  import axios from 'axios';
  import Navbar from './components/Navbar.vue';
  import OutfitGenerator from './components/OutfitGenerator.vue';
  export default{
    name: 'App',
    components: {
      OutfitGenerator,
      Navbar
    },
    data() {
      return {
        loggedIn: false,
      };
    },
    mounted() {
      this.checkSession();
    },
    watch: {
      $route() {
        this.checkSession();
      }
    },
    methods: {
      handleLoginSuccess() {
        this.loggedIn = true;
      },
      async handleLogout() {
        try {
          const response = await axios.post('http://localhost:5000/api/accounts/logout', {}, { withCredentials: true });
          console.log('Logout successful:', response.data);
          // this.$router.push('/login');
        } catch (error) {
          console.error('Logout failed:', error);  
          }
        this.loggedIn = false;
      },
      async checkSession() {
        // Check if user is logged in
        try {
          const response = await axios.get('http://localhost:5000/api/accounts/session', {withCredentials: true});
          console.log('Session data:', response.data);
          this.loggedIn = response.data.loggedIn;
        } catch (error) {
          this.loggedIn = false;
          console.error('Session error:', error);
        }
      }
    }
  }
</script>