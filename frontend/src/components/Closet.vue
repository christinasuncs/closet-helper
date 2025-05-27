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
      <v-btn 
        color="error" 
        class="ml-2" 
        :disabled="selectedImageIds.length == 0"
        @click="archiveSelectedImages()">
        Archieve Selected 
      </v-btn>
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
      <v-col 
        v-for="(image, index) in filteredImages" 
        :key="index" 
        cols="12" 
        md="4" 
        sm="6" 
        lg="3"
        @click="toggleSelectImage(image._id)"
      >
        <v-card class="image-card" :class="{'selected-image': selectedImageIds.includes(image._id)}">
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
      selectedImageIds: [],
    };
  },
  mounted() {
    this.getImages();
  },
  watch: {
    // watch types filter
    'filterTypes': function(newValue, oldValue) {
      if (newValue == ''){
        this.applyFilter()
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
        this.applyFilter()
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
      let filtered = this.images.filter(image => !image.archived)
      if (this.filterTypes && this.filterTypes.length > 0) {
        filtered = filtered.filter(image => this.filterTypes.includes(image.type));
      }
      this.filteredImages = filtered;
      this.selectedImageIds = this.selectedImageIds.filter(id => 
        this.filteredImages.some(image => image._id === id)
      );
    },
    clearFilters(){
      this.filterTypes = []
      this.applyFilter()
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
    async archiveImage(imageId) {
      try {
        this.editedImage = this.images.find(image => image._id === imageId);
        this.editedImage.archived = !this.editedImage.archived;
        await axios.put(`http://localhost:5000/api/images/archive/${imageId}`, this.editedImage);
        this.snackbarText = 'Image archived successfully!',
        this.snackbar = true,
        this.getImages()
      } catch (err) {
        console.error('Failed to archive image:', err);
        this.snackbarText = 'Failed to archive image. Please try again.';
        this.snackbar = true;
      }
    },
    toggleSelectImage(imageId) {
      console.log(this.selectedImageIds)
      const index = this.selectedImageIds.indexOf(imageId);
      if (index == -1) {
        this.selectedImageIds.push(imageId);
      } else {
        this.selectedImageIds.splice(index, 1);
      }
    },
    async archiveSelectedImages(){
      try {
        await Promise.all(this.selectedImageIds.map(id => {
          axios.put(`http://localhost:5000/api/images/archive/${id}`, { archived: true });
        }));
        this.snackbarText = 'Selected images archived successfully!',
        this.snackbar = true,
        this.selectedImageIds = [];
        this.getImages();
      } catch (err) {
        console.error('Failed to archive selected images:', err);
        this.snackbarText = 'Failed to archive selected images. Please try again.';
        this.snackbar = true;
      }
    }
  },
}
</script>
  
  
<style scoped>
.image-card {
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s;
}
.selected-image {
  border: 3px solid #1976d2 !important;
  box-shadow: 0 0 10px #1976d2;
}

</style>