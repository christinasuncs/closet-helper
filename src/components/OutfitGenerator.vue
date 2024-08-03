<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="generate">Generate</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <!-- <v-col>
        <v-img :src="randomTop"></v-img>

      </v-col> -->
      <v-col 
        v-for="(item, index) in outfit"
        :key="index"
      >
        <v-img :src="item" :width="200"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import top1 from '../assets/tops/shirt.png'
export default {
  name: "OutfitGeneratorView",
  data() {
    return {
      image: top1,
      tops: [],
      bottoms: [],
      hats: [],
      shoes: [],
      accessories: [],

      outfit: [],
      randomTop: '',
      randomBottom: ''
    }
  },
  mounted() {
    this.loadImages()
  },
  methods: {
    async loadImages() {
      const tops = import.meta.glob(`/src/assets/tops/*.{png,jpg}`)
      this.tops = await this.resolveImages(tops)

      const bottoms = import.meta.glob(`/src/assets/bottoms/*.{png,jpg}`)
      this.bottoms = await this.resolveImages(bottoms)

      const hats = import.meta.glob(`/src/assets/hats/*.{png,jpg}`)
      this.hats = await this.resolveImages(hats)

      const shoes = import.meta.glob(`/src/assets/shoes/*.{png,jpg}`)
      this.shoes = await this.resolveImages(shoes)

      const accessories = import.meta.glob(`/src/assets/accessories/*.{png,jpg}`)
      this.accessories = await this.resolveImages(accessories)
    },
    async resolveImages(images) {
      const imagePaths = []
      for (const path in images) {
        imagePaths.push(path)
      }
      return imagePaths
    },
    generate() {
      this.outfit = [
        this.getRandomItem(this.tops), 
        this.getRandomItem(this.bottoms), 
        this.getRandomItem(this.hats), 
        this.getRandomItem(this.shoes), 
        this.getRandomItem(this.accessories)]
    },
    getRandomItem(items) {
      const arrLength = items.length
      const randomIndex = Math.floor(Math.random() * arrLength)
      return items[randomIndex]
    }
  },
}
</script>