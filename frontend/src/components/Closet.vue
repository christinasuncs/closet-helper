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

  <v-carousel style="width: 600px;">
    <v-carousel-item
      v-for="(outfit, index) in outfits"
      :key="index"
      class="carousel-item"
    >
      <v-row class="outfit-row">
        <!-- Fit section -->
        <v-col cols="8">
          <v-row>
            <v-img :src="outfits[index].hat.url" class="fit-img"></v-img>
          </v-row>
          <v-row>
            <v-img :src="outfits[index].top.url" class="fit-img"></v-img>
          </v-row>
          <v-row>
            <v-img :src="outfits[index].bottom.url" class="fit-img"></v-img>
          </v-row>
          <v-row>
            <v-img :src="outfits[index].shoes.url" class="fit-img"></v-img>
          </v-row>
        </v-col>
        <!-- Accessory section -->
        <v-col cols="4">
          <v-img :src="outfits[index].accessory.url" class="accessory-img"></v-img>
        </v-col>
      </v-row>
    </v-carousel-item>
  </v-carousel>

  <v-container fluid>
    <!-- Grid Layout for Saved Outfits -->
    <v-row class="mt-4" dense>
      <v-col cols="12" md="4" v-for="(outfit, index) in outfits" :key="index">
        <v-card outlined>
          <v-card-title class="justify-center">
            <span class="font-weight-bold">Outfit {{ index + 1 }}</span>
          </v-card-title>
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

    <!-- Edit Modal -->
    <v-dialog v-model="edit_outfit_dialog" max-width="500px">
      <v-card>
        <v-card-title>Edit Outfit</v-card-title>
        <v-card-text>
          <v-form>
            <!-- hat + hat dropdown -->
            <v-select
              v-model="editedOutfit.hat"
              :items="hats"
              label="Select Hat"
              item-value="_id"
              return-object
            >
              <!-- use slot because select only allows text -->
              <template v-slot:item="data">
                <v-list-item @click="selectHat(data.item.props.title)">
                  <v-list-item-avatar>
                    <v-img :src="data.item.props.title.url" :width="100"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.props.title.url }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-slot:selection="data">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img :src="data.item.props.title.url" :width="100"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.props.title.url }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
            <!-- top + top dropdown -->
            <v-select
              v-model="editedOutfit.top"
              :items="tops"
              label="Select Top"
              item-value="_id"
              return-object
            >
              <!-- use slot because select only allows text -->
              <template v-slot:item="data">
                <v-list-item @click="selectTop(data.item.props.title)">
                  <v-list-item-avatar>
                    <v-img :src="data.item.props.title.url" :width="100"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.props.title.url }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-slot:selection="data">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img :src="data.item.props.title.url" :width="100"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.props.title.url }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
            <!-- bottom + bottom dropdown -->
            <v-select
              v-model="editedOutfit.bottom"
              :items="bottoms"
              label="Select Bottom"
              item-value="_id"
              return-object
            >
              <!-- use slot because select only allows text -->
              <template v-slot:item="data">
                <v-list-item @click="selectBottom(data.item.props.title)">
                  <v-list-item-avatar>
                    <v-img :src="data.item.props.title.url" :width="100"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.props.title.url }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-slot:selection="data">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img :src="data.item.props.title.url" :width="100"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.props.title.url }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
            <!-- shoes + shoes dropdown -->
            <v-select
              v-model="editedOutfit.shoes"
              :items="shoes"
              label="Select Shoes"
              item-value="_id"
              return-object
            >
              <!-- use slot because select only allows text -->
              <template v-slot:item="data">
                <v-list-item @click="selectShoes(data.item.props.title)">
                  <v-list-item-avatar>
                    <v-img :src="data.item.props.title.url" :width="100"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.props.title.url }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-slot:selection="data">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img :src="data.item.props.title.url" :width="100"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.props.title.url }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
            <!-- accessory + accessory dropdown -->
            <v-select
              v-model="editedOutfit.accessory"
              :items="accessories"
              label="Select Accessory"
              item-value="_id"
              return-object
            >
              <!-- use slot because select only allows text -->
              <template v-slot:item="data">
                <v-list-item @click="selectAccessory(data.item.props.title)">
                  <v-list-item-avatar>
                    <v-img :src="data.item.props.title.url" :width="100"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.props.title.url }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-slot:selection="data">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img :src="data.item.props.title.url" :width="100"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.props.title.url }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>

          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="">Save</v-btn>
          <v-btn color="grey darken-1" text @click="edit_outfit_dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ClosetView',
  data() {
    return{      
      tops: [],
      bottoms: [],
      hats: [],
      shoes: [],
      accessories: [],

      outfits: [],
      deleteAlert: false,
      edit_outfit_dialog: false,

      editedOutfit: {
        hat: '',
        top: '',
        bottom: '',
        shoes: '',
        accessory: ''
      }
    }
  }, 
  mounted() {
    this.loadOutfits()
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
        console.log(this.hats)
      } catch (err) {
        console.error('Failed to load images:', err);
      }
    },
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
        this.deleteAlert = true
      } catch (err) {
        console.log("Failed to delete outfit: ", err)
      }
    },
    openEditModal(outfit) {
      this.edit_outfit_dialog = true
      this.editedOutfit = outfit
      console.log(this.editedOutfit)
    },
    async saveEditedOutfit() {
      // have editedOutfit -> body of what changed during edit
      // call api and pass in
      // + before/after behaviour
      // restructure editedOutfit to only keep ids
      try {
        await axios.put(`http://localhost:5000/api/outfit/edit/${this.editedOutfit.id}`, this.editedOutfit)
        console.log("saved edits successful")
        this.loadOutfits()
        this.edit_outfit_dialog = false
      } catch (err) {
        console.log("Failed to save edited outfit: ", err)
      }
    },
    selectHat(item) {
      this.editedOutfit.hat = item;
      // console.log(this.editedOutfit.hat)
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