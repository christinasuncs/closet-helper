<template>
  <v-container fluid>
    <div style="display: flex;">
      <v-select
        chips
        style="width: 20%; margin-right: 1%;"
        label="Filter by Tags"
        v-model="filterTypes"
        :items="types.map(type => type.name)"
      ></v-select>  
      <v-btn @click="clearFilters()">Clear Filters</v-btn>
    </div>
    <!-- file input -->
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="6">
        <v-file-input 
          v-model="selectedImages"
          label="Upload Image(s)" 
          prepend-icon="mdi-camera" 
          accept="image/*" 
          outlined
          chips
          multiple
          ></v-file-input>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedType"
          label="Select Type"
          :items="uploadTypes.map(type => type.value)"
        ></v-select>
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn
          color="primary"
          @click="uploadImage"
          :disabled="!selectedImages.length || !selectedType"
          block
        >Upload</v-btn>
      </v-col>
    </v-row>

    <!-- images -->
    <v-row>
      <v-col v-for="(image, index) in filteredImages" :key="index" cols="12" md="4" sm="6" lg="3">
        <v-card>
          <v-img :src="image.url" aspect-ratio="1" class="white--text align-end"></v-img>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" timeout="3000" color="success">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>
<script>
import axios from 'axios';
export default {
  name: 'Closet View',
  data() {
    return {
      images: [],
      filteredImages: [],
      selectedImages: [],
      snackbar: false,
      snackbarText: '',
      uploadTypes: [
        { text: 'Top', value: 'top' },
        { text: 'Bottom', value: 'bottom' },
        { text: 'Shoes', value: 'shoes' },
        { text: 'Hat', value: 'hat' },
        { text: 'Accessory', value: 'accessory' },
      ],
      selectedType: '',
      filterTypes: [],
      types: [
        { name: 'top' },
        { name: 'bottom' },
        { name: 'shoes' },
        { name: 'hat' },
        { name: 'accessory' },
      ],
    };
  },
  mounted() {
    this.getImages();
  },
  watch: {
    // watch types filter
    'filterTypes': function(newValue, oldValue) {
      if (newValue == ''){
        this.filteredImages = this.images
      } else {
        this.applyFilter()
      }
    }
  },
  methods: {
    async getImages() {
      try {
        const images = await axios.get(`https://closet-backend-huo7.onrender.com/api/images`); // change link to whatever it is
        this.images = images.data
        this.filteredImages = images.data
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
    applyFilter(){
      this.filteredImages = this.images.filter(image => {
        const imageType = image.type
        return imageType == this.filterTypes
      })
    },
    clearFilters(){
      this.filterTypes = []
    },
    async uploadImage() {
      if (!this.selectedImages.length) {
        alert('Please select an image to upload.');
        return;
      }
      if (!this.selectedType) {
        alert('Please select a type for the image.');
        return;
      }
      const formData = new FormData();
      this.selectedImages.forEach((image) => {
        formData.append('images', image); // Append each selected image to the FormData object
      });
      formData.append('type', this.selectedType);
      try {
        const response = await axios.post('http://localhost:5000/api/images/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          
        });

        this.snackbarText = 'Image uploaded successfully!',
        this.snackbar = true,
        this.selectedImages = [],
        this.selectedType = "",
        this.getImages()
      } catch (err) {
        console.error('Failed to upload image(s):', err);
        this.snackbarText = 'Failed to upload image(s). Please try again.';
        this.snackbar = true;
      }
    },
  },
}
</script>
  
  
<style>
</style>