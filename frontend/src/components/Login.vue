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
            type="password"
            v-model="password"
            ></v-text-field>
        <v-btn
          color="primary"
          @click="login()"
          block
          :loading="loading"
          :readonly="loading"
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
        <text-body-1>Username</text-body-1>
        <v-text-field
          label="Username"
          type="text"
          v-model="newuser.username"
        ></v-text-field>
        </v-row>
        <v-row>
        <text-body-1>Password</text-body-1>
        <v-text-field
          label="Password"
          type="text"
          v-model="newuser.password"
        ></v-text-field>
        <v-btn
          color="primary"
          @click="createAccount()"
          block
        >Create Account</v-btn>
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
  <v-snackbar v-model="snackbar" timeout="3000" :color="snackbarColor">
    {{ snackbarText }}
  </v-snackbar>
</template>
<script>
import axios from 'axios';
export default {
  name: 'Login View',
  emits: ['login-success'],
  data() {
    return {
      createAccountDialog: false,
      username: '',
      password: '',
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      loading: false,
      newuser: {
        username: '',
        password: ''
      }
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
        this.loading = true
        const response = await axios.post('http://localhost:5000/api/accounts/login', {
          username: this.username,
          password: this.password
        },
        { withCredentials: true }); // Include credentials for session management
        // Handle successful login (e.g., redirect, store token)
        this.snackbarText = 'Login successful!',
        this.snackbarColor = 'success';
        this.snackbar = true  
        this.$emit('login-success');
        setTimeout(() => {
          this.$router.push('/'); // Redirect to closet after login
          this.loading = false
        }, 1000); // Delay to show snackbar message  
      } catch (error) {
        console.error('Login failed:', error);
        // Handle login failure (e.g., show error message)
        this.snackbarText = 'Login failed; please try again.';
        this.snackbarColor = 'error';
        this.snackbar = true;      
      }
    },
    async createAccount() {
      try {
        this.loading = true;
        console.log('Creating account with:', this.newuser);
        const response = await axios.post('http://localhost:5000/api/accounts/register', {
          username: this.newuser.username,
          password: this.newuser.password
        });
        this.snackbarText = 'Account created successfully!';
        this.snackbarColor = 'success';
        this.snackbar = true;
        this.createAccountDialog = false;
        setTimeout(() => {
          this.$router.push('/login'); // Redirect to login after account creation
          this.loading = false;
        }, 1000); // Delay to show snackbar message
      } catch (error) {
        console.error('Account creation failed:', error);
        this.snackbarText = 'Account creation failed; please try again.';
        this.snackbarColor = 'error';
        this.snackbar = true;
      }
    }
  }
}
</script>
  
  
<style scoped>
</style>