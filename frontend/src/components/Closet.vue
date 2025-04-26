<template>
  <v-container fluid>
    <!-- file input -->
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="6">
        <v-file-input 
          v-model="selectedImage"
          label="Upload Image" 
          prepend-icon="mdi-camera" 
          accept="image/*" 
          outlined></v-file-input>
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn
          color="primary"
          @click="uploadImage"
        >Upload</v-btn>
      </v-col>
    </v-row>

    <!-- images -->
    <v-row>
      <v-col v-for="(image, index) in images" :key="index" cols="12" md="4" sm="6" lg="3">
        <v-card>
          <v-img :src="image.url" aspect-ratio="1" class="white--text align-end"></v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
import axios from 'axios';
export default {
  name: 'Closet View',
  data() {
    return {
      images: [],
      selectedImage: null,
    };
  },
  mounted() {
    this.getImages();
  },
  methods: {
    async getImages() {
      try {
        const images = await axios.get(`https://closet-backend-huo7.onrender.com/api/images`); // change link to whatever it is
        this.images = images.data
        // images.data.forEach(image => {
        //   if(image.type == "top") {
        //     this.tops.push(image)
        //   } else if (image.type == "bottom") {
        //     this.bottoms.push(image)
        //   } else if (image.type == "shoes") {
        //     this.shoes.push(image)
        //   } else if (image.type == "hat") {
        //     this.hats.push(image)
        //   } else if (image.type == "accessory") {
        //     this.accessories.push(image)
        //   }
        // });
      } catch (err) {
        console.error('Failed to load images:', err);
      }
    },
    async uploadImage() {
      const formData = new FormData();
      formData.append('image', this.selectedImage);
      try {
        const response = await axios.post('http://localhost:5000/api/images/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.images.push(response.data); // Assuming the response contains the uploaded image data
        this.selectedImage = null; // Reset the file input
      } catch (err) {
        console.error('Failed to upload image:', err);
      }
    },
  },
}
</script>
  
  
<style>
</style>