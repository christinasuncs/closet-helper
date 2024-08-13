<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-for="(outfit, index) in outfits" :key="index" style="border: solid">
        <v-row>
          <!-- fit -->
          <v-col cols="6"> 
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
        const outfits = await axios.get(`http://localhost:5000/outfits`)
        // console.log(outfits)
        this.outfits = outfits.data
      } catch (err) {
        console.error('Failed to load outfits:', err);
      }
    }
  }
};
</script>

<!-- use rows and cols to display outfits
  make method to fetch all otufits when first loading -->