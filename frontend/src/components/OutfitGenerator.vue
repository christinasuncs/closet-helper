<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn>Save</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="unlockAll()" :disabled="outfit == []">Unlock All</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-row v-for="(item, index) in outfit.slice(0, -1)" :key="index">
          <v-col cols="4">
            <v-btn icon @click="toggleLocks(index)">
              <v-icon :icon="decideLock(index) ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'"></v-icon>
            </v-btn>
          </v-col>
          <v-col cols="8">
            <v-img :src="item.url" :width="120" class="mx-auto"></v-img>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row v-if="outfit[outfit.length - 1]">
          <v-col cols="8">
            <v-img :src="outfit[outfit.length - 1].url" :width="120" class="mx-auto"></v-img>
          </v-col>      
          <v-col cols="4">
            <v-btn icon @click="toggleLocks(4)">
              <v-icon :icon="decideLock(4) ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'"></v-icon>
            </v-btn>          
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="generate" append-icon="mdi-reload" :loading="loading">Generate</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: "OutfitGeneratorView",
  data() {
    return {
      tops: [],
      bottoms: [],
      hats: [],
      shoes: [],
      accessories: [],

      outfit: [],

      locks: {
        hat: false,
        top: false,
        bottom: false,
        shoes: false,
        accessory: false
      },

      loading: false
    }
  },
  mounted() {
    this.loadImages()
  },
  methods: {
    async loadImages() {
      try {
        // console.log(process.env.VUE_APP_DEV_URL)
        const images = await axios.get(`http://localhost:5000/images`); // change link to whatever it is
        // console.log(images)
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
        // console.log(this.accessories)
      } catch (err) {
        console.error('Failed to load images:', err);
      }

    },
    generate() {
      const lockedOutfit = this.outfit

      this.outfit = [
        this.getRandomItem(this.hats), 
        this.getRandomItem(this.tops), 
        this.getRandomItem(this.bottoms), 
        this.getRandomItem(this.shoes), 
        this.getRandomItem(this.accessories)
      ]

      if (this.locks.hat) {
        this.outfit[0] = lockedOutfit[0]
      } 
      if (this.locks.top) {
        this.outfit[1] = lockedOutfit[1]
      }  
      if (this.locks.bottom) {
        this.outfit[2] = lockedOutfit[2]
      }  
      if (this.locks.shoes) {
        this.outfit[3] = lockedOutfit[3]
      } 
      if (this.locks.accessory) {
        this.outfit[4] = lockedOutfit[4]
      }

    },
    getRandomItem(items) {
      const arrLength = items.length
      const randomIndex = Math.floor(Math.random() * arrLength)
      return items[randomIndex]
    },
    toggleLocks(index) {
      if (index == 0) {
        this.locks.hat = !this.locks.hat
      } else if (index == 1) {
        this.locks.top = !this.locks.top
      } else if (index == 2) {
        this.locks.bottom = !this.locks.bottom
      } else if (index == 3) {
        this.locks.shoes = !this.locks.shoes
      } else {
        this.locks.accessory = !this.locks.accessory
      }
    },
    decideLock(index) {
      if (index == 0) {
        return this.locks.hat
      } else if (index == 1) {
        return this.locks.top
      } else if (index == 2) {
        return this.locks.bottom
      } else if (index == 3) {
        return this.locks.shoes
      } else {
        return this.locks.accessory
      }
    },
    unlockAll() {
      this.locks = {
        hat: false,
        top: false,
        bottom: false,
        shoes: false,
        accessory: false
      }
    }
  },
}
</script>

<!-- <style scoped>
.v-img {
  border: 1px solid #ccc;
  border-radius: 8px;
}

</style> -->