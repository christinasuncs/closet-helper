<template>
  <v-container>
    <v-carousel>
      <v-carousel-item v-for="(outfit, index) in outfits" :key="index" style="border: solid">
        <v-row>
          <!-- fit -->
          <v-col cols="6"> 
            <p>work</p>
            <v-row>
              <v-img :src="outfits[index].hat.url"></v-img>
            </v-row> 
            <v-row>
              <v-img :src="outfits[index].top.url"></v-img>
            </v-row> 
            <v-row>
              <v-img :src="outfits[index].bottom.url"></v-img>
            </v-row> 
            <v-row>
              <v-img :src="outfits[index].shoes.url"></v-img>
            </v-row>
          </v-col>
          <!-- accessory -->
          <v-col cols="6">
            <v-img :src="outfits[index].accessory.url"></v-img>
          </v-col>
        </v-row>
      </v-carousel-item>

      <!-- <v-carousel-item
        src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
      ></v-carousel-item>

      <v-carousel-item
        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
      ></v-carousel-item> -->
    </v-carousel>
  </v-container>

  <v-container>
    <v-row>
      <v-col cols="12" v-for="(outfit, index) in outfits" :key="index" style="border: solid">
        <v-btn icon="mdi-trash-can-outline" @click="deleteOutfit(outfit._id)"></v-btn>
        <v-row>
          <!-- fit -->
          <v-col cols="6"> 
            <v-row>
              <v-img :src="outfit.hat.url"></v-img>
            </v-row> 
            <v-row>
              <v-img :src="outfit.top.url"></v-img>
            </v-row> 
            <v-row>
              <v-img :src="outfit.bottom.url"></v-img>
            </v-row> 
            <v-row>
              <v-img :src="outfit.shoes.url"></v-img>
            </v-row>
          </v-col>
          <!-- accessory -->
          <v-col cols="6">
            <v-img :src="outfit.accessory.url"></v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ClosetView',
  data() {
    return{
      outfits: []
    }
  }, 
  mounted() {
    this.loadOutfits()
  },
  methods: {
    async loadOutfits() {
      try {
        const outfits = await axios.get(`http://localhost:5000/api/outfit`)
        // console.log(outfits)
        this.outfits = outfits.data
      } catch (err) {
        console.error('Failed to load outfits:', err);
      }
    },
    async deleteOutfit(id){
      try {
        console.log(id)
        await axios.delete(`http://localhost:5000/api/outfit/delete/${id}`)
        console.log("delete successful")
        this.loadOutfits()
      } catch (err) {
        console.log("Failed to delete outfit: ", err)
      }
    }
  }
};
</script>

<!-- use rows and cols to display outfits
  make method to fetch all otufits when first loading -->

<style>

</style>