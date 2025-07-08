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
        Archive Selected 
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
    <v-btn
      color="primary"
      fab
      @click="archiveDialog = true"
      class="archive-button"
    ><v-icon>mdi-archive</v-icon></v-btn>
    <v-dialog v-model="archiveDialog" max-width="900px">
      <v-card style="display: flex; flex-direction: column;" max-height="80vh">
        <v-card-title> Archived Images </v-card-title>
        <v-card-text
          style="overflow-y: auto; flex:1 1 auto;">
          
        <v-row>
          <v-col 
            v-for="(image, index) in archivedImages" 
            :key="index" 
            cols="12" 
            md="4" 
            sm="6" 
            lg="3"
            @click="toggleArchiveImage(image._id)"
          >
            <v-card class="image-card" :class="{'selected-image': unarchiveImageIds.includes(image._id)}">
              <v-img :src="image.url" aspect-ratio="1" class="white--text align-end"></v-img>
            </v-card>
          </v-col>
        </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn 
            color="error"  
            class="mr-2"
            :disabled="unarchiveImageIds.length == 0"
            @click="unarchiveSelectedImages()">
            Unarchive Selected 
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text="Close Dialog"
            @click="archiveDialog = false; unarchiveImageIds = []"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      unarchiveImageIds: [],
      archiveDialog: false,
      archivedImages: [],
      user: null,
      loggedIn: false,
    };
  },
  mounted() {
    this.checkSession();
  },
  computed: {
    archivedImages() {
      return this.images.filter(image => image.archived);
    },
  },
  watch: {
    // watch types filter
    'filterTypes': function(newValue, oldValue) {
      if (newValue == ''){
        this.applyFilter()
      } else {
        this.applyFilter()
      }
    },
    archiveDialog: function(newValue) {
      if (newValue) {
        this.archivedImages = this.images.filter(image => image.archived);
      } else {
        this.unarchiveImageIds = [];
      }
    },
  },
  methods: {
    async checkSession() {
      try {
        const res = await axios.get('http://localhost:5000/api/accounts/session', { withCredentials: true });
        if (res.data.loggedIn) {
          this.loggedIn = true;
          this.user = res.data.user;
        } else {
          this.loggedIn = false;
          this.user = null;
        }
      } catch (err) {
        this.loggedIn = false;
        this.user = null;
      }
      this.getImages();
    },
    async getImages() {
      try {
        let images = [];
        if (this.loggedIn && this.user && this.user.id) {
          // Fetch images for this account
          const res = await axios.get(`http://localhost:5000/api/images/${this.user.id}`);
          images = res.data;
        } else {
          // Fetch all public images
          const res = await axios.get('http://localhost:5000/api/images');
          images = res.data;
        }
        this.images = images;
        this.applyFilter();
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
      formData.append('account_id', '685466a5eeb08e0151f1ed2d'); 
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
    },
    toggleArchiveImage(imageId) {
      const index = this.unarchiveImageIds.indexOf(imageId);
      if (index == -1) {
        this.unarchiveImageIds.push(imageId);
      } else {
        this.unarchiveImageIds.splice(index, 1);
      }
    },
    async unarchiveSelectedImages(){
      try {
        await Promise.all(this.unarchiveImageIds.map(id => {
          axios.put(`http://localhost:5000/api/images/archive/${id}`, { archived: false });
        }));
        this.snackbarText = 'Selected images unarchived successfully!',
        this.snackbar = true,
        this.unarchiveImageIds = [];
        this.getImages();
      } catch (err) {
        console.error('Failed to unarchive selected images:', err);
        this.snackbarText = 'Failed to unarchive selected images. Please try again.';
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

.archive-button {
  position: fixed;
  bottom: 30px;
  right: 50px;
  z-index: 1000;
}
</style>