<template>
    <v-alert
      type="success"
      v-model="deleteAlert"
      close-label="Close Alert"
      title="Outfit Deleted!"
      variant="tonal"
      closable
      >
    </v-alert>
  
    <v-container fluid>  
      <!-- Grid Layout for Saved Outfits -->
      <v-row class="mt-4" dense>
        <v-col cols="12" md="4" v-for="(outfit, index) in filteredOutfits" :key="index">
          <v-card outlined>
            <v-card-title class="justify-center">
              <v-row class="justify-center" v-for="(tag, index) in outfit.tags" :key="index">{{ tag.name }}</v-row>
            </v-card-title>
            <br/>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-img :src="outfit.hat.url" contain height="100px"></v-img>
                </v-col>
                <v-col cols="6">
                  <v-img :src="outfit.top.url" contain height="100px"></v-img>
                </v-col>
                <v-col cols="6">
                  <v-img :src="outfit.bottom.url" contain height="100px"></v-img>
                </v-col>
                <v-col cols="6">
                  <v-img :src="outfit.shoes.url" contain height="100px"></v-img>
                </v-col>
                <v-col cols="12">
                  <v-img :src="outfit.accessory.url" contain height="100px"></v-img>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions style="display: flex; justify-content: space-between">
              <v-btn icon="mdi-pencil-outline" @click="openEditModal(outfit)"></v-btn>
              <v-btn icon="mdi-trash-can-outline" @click="deleteOutfit(outfit._id)"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    name: 'OutfitsView',
    data() {
      return{      
        tops: [],
        bottoms: [],
        hats: [],
        shoes: [],
        accessories: [],
  
        outfits: [],
        filteredOutfits: [],
        deleteAlert: false,
        edit_outfit_dialog: false,
        new_tag_dialog: false,
  
        editedOutfit: {
          hat: '',
          top: '',
          bottom: '',
          shoes: '',
          accessory: '',
          tags: []
        },
        tags: [],
        newTag: '',
        filterTags: [],
  
        activeSlide: 0
      }
    }, 
    mounted() {
      this.loadOutfits()
      this.loadImages()
      this.loadTags()
    },
    watch: {
      // watch tags filter
      'filterTags': function(newValue, oldValue) {
        console.log(this.filterTags)
        if (newValue == ''){
          this.filteredOutfits = this.outfits
        } else {
          this.applyFilter()
        }
      }
    },
    methods: {
      filterCheck(array1, array2) {
        // check if filterTags[] is part of outfitTags[]
        // make sure everything in arr1 is in arr2
        for (let i = 0; i < array1.length; i++) {
          if (!array2.includes(array1[i])) {
            return false
          }
        }
        return true
      },
      applyFilter(){
        this.filteredOutfits = this.outfits.filter(outfit => {
          const outfitTags = outfit.tags.map(tag => tag.name) // gives array of tag names for each outfit
          // make sure filterTags in outfitTags
          return this.filterCheck(this.filterTags, outfitTags)
        })
      },
      clearFilters(){
        this.filterTags = []
      },
      async loadImages() {
        try {
          const images = await axios.get(`https://closet-backend-huo7.onrender.com/api/images`); // change link to whatever it is
          images.data.forEach(image => {
            if(image.type == "top") {
              this.tops.push(image)
            } else if (image.type == "bottom") {
              this.bottoms.push(image)
            } else if (image.type == "shoes") {
              this.shoes.push(image)
            } else if (image.type == "hat") {
              this.hats.push(image)
            } else if (image.type == "accessory") {
              this.accessories.push(image)
            }
          });
        } catch (err) {
          console.error('Failed to load images:', err);
        }
      },
      async loadOutfits() {
        try {
          const outfits = await axios.get(`https://closet-backend-huo7.onrender.com/api/outfit`)
          this.outfits = outfits.data
          this.filteredOutfits = outfits.data
        } catch (err) {
          console.error('Failed to load outfits:', err);
        }
      },
      async loadTags() {
        try {
          const tags = await axios.get(`https://closet-backend-huo7.onrender.com/api/tags`)
          this.tags = tags.data
        } catch (err) {
          console.error('Failed to load tags:', err);
        }
      },
      async deleteOutfit(id){
        try {
          await axios.delete(`https://closet-backend-huo7.onrender.com/api/outfit/delete/${id}`)
          this.loadOutfits()
          this.deleteAlert = true
        } catch (err) {
          console.log("Failed to delete outfit: ", err)
        }
      },
      openNewTagModal(){
        this.new_tag_dialog = true
      },
      openEditModal(outfit) {
        this.edit_outfit_dialog = true
        this.editedOutfit = outfit
        this.editedOutfit.tags = outfit.tags.map(tag => tag.name)
      },
      async saveEditedOutfit() {
        // have editedOutfit -> body of what changed during edit
        // call api and pass in
        // + before/after behaviour
        // restructure editedOutfit to only keep ids
        try {
          const tagNameToIdMap = {}
          this.tags.forEach(tag => {
            tagNameToIdMap[tag.name] = tag;
          })
  
          this.editedOutfit = {
            _id: this.editedOutfit._id,
            hat: this.editedOutfit.hat._id,
            top: this.editedOutfit.top._id,
            bottom: this.editedOutfit.bottom._id,
            shoes: this.editedOutfit.shoes._id,
            accessory: this.editedOutfit.accessory._id,
            tags: this.editedOutfit.tags.map(tag => tagNameToIdMap[tag]._id)
          }
          
          await axios.put(`https://closet-backend-huo7.onrender.com/api/outfit/edit/${this.editedOutfit._id}`, this.editedOutfit)
          this.loadOutfits()
          this.edit_outfit_dialog = false
        } catch (err) {
          console.log("Failed to save edited outfit: ", err)
        }
      },
      async saveNewTag() {
        try {
          const newTag = {name: this.newTag}
          await axios.post(`https://closet-backend-huo7.onrender.com/api/tags/new`, newTag)
          this.loadTags()
          this.new_tag_dialog = false
        } catch (err) {
          console.log("Failed to create new tag: ", err)
        }
      },
      selectHat(item) {
        this.editedOutfit.hat = item;
      },
      selectTop(item) {
        this.editedOutfit.top = item;
      },
      selectBottom(item) {
        this.editedOutfit.bottom = item;
      },
      selectShoes(item) {
        this.editedOutfit.shoes = item;
      },
      selectAccessory(item) {
        this.editedOutfit.accessory = item;
      }
    }
  };
  </script>
  
  <!-- use rows and cols to display outfits
    make method to fetch all otufits when first loading -->
  
  <style>
    .v-card {
      margin-bottom: 16px;
    }
  
    .carousel-item {
      border: solid 1px #ccc;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }
  
    .outfit-row {
      align-items: center;
    }
  
    .fit-img {
      width: auto;
      height: 100px;
      max-width: 100%;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    .accessory-img {
      width: auto;
      height: 250px;
      max-width: 100%;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  </style>