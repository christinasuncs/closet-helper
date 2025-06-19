<template>
  <v-container fluid>
    <!-- login -->
    <text-h1 class="text-center">Login</text-h1>
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="6">
        <text-body-1>Username</text-body-1>
        <v-text-field
            label="Username"
            type="text"
            v-model="username"
            ></v-text-field>
        <text-body-1>Password</text-body-1>
        <v-text-field
            label="Password"
            type="text"
            v-model="password"
            ></v-text-field>
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn
          color="primary"
          @click="login()"
          block
        >Log in</v-btn>
      </v-col>
    </v-row>

    <v-btn
        color="primary"
        variant="tonal"
        @click="createAccountDialog = true"
        block
    >Create Account</v-btn>
    <v-dialog v-model="createAccountDialog" max-width="900px">
      <v-card style="display: flex; flex-direction: column;" max-height="80vh">
        <v-card-title> Create Account </v-card-title>
        <v-card-text
          style="overflow-y: auto; flex:1 1 auto;">
          
        <v-row>
          <v-col cols="12" md="6">
        <text-body-1>Username</text-body-1>
        <v-text-field
            label="Username"
            type="username"
            ></v-text-field>
        <text-body-1>Password</text-body-1>
        <v-text-field
            label="Password"
            type="password"
            ></v-text-field>
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn
          color="primary"
          @click="createAccount()"
          block
        >Create Account</v-btn>
      </v-col>
        </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Close Dialog"
            @click="createAccountDialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from 'axios';
export default {
  name: 'Login View',
  data() {
    return {
        createAccountDialog: false,
        username: '',
        password: '',
    }
  },
  mounted() {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:5000/api/accounts/login', {
          username: this.username,
          password: this.password
        });
        console.log('Login successful:', response.data);
        // Handle successful login (e.g., redirect, store token)
      } catch (error) {
        console.error('Login failed:', error);
        // Handle login failure (e.g., show error message)
      }
    },
  }
}
</script>
  
  
<style scoped>
</style>