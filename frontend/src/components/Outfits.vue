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

  <v-carousel class="justify-center" v-model="activeSlide" show-arrows="hover">
    <v-carousel-item
      v-for="(outfit, index) in outfits"
      :key="index"
      class="carousel-item"
    >
      <v-row class="outfit-row">
        <!-- Fit section -->
        <v-col cols="8">
          <v-row>
            <v-img v-if="outfits[index].hat && outfits[index].hat.url" :src="outfits[index].hat.url" class="fit-img"></v-img>
            <div v-else style="height: 100px;"></div>
          </v-row>
          <v-row>
            <v-img v-if="outfits[index].top && outfits[index].top.url" :src="outfits[index].top.url" class="fit-img"></v-img>
            <div v-else style="height: 100px;"></div>
          </v-row>
          <v-row>
            <v-img v-if="outfits[index].bottom && outfits[index].bottom.url" :src="outfits[index].bottom.url" class="fit-img"></v-img>
            <div v-else style="height: 100px;"></div>
          </v-row>
          <v-row>
            <v-img v-if="outfits[index].shoes && outfits[index].shoes.url" :src="outfits[index].shoes.url" class="fit-img"></v-img>
            <div v-else style="height: 100px;"></div>
          </v-row>
        </v-col>
        <!-- Accessory section -->
        <v-col cols="4">
          <v-img v-if="outfits[index].accessory && outfits[index].accessory.url" :src="outfits[index].accessory.url" class="accessory-img"></v-img>
          <div v-else style="height: 100px;"></div>
        </v-col>
      </v-row>
    </v-carousel-item>
  </v-carousel>

  <!-- Filter Select -->
  <v-container fluid>
    <div style="display: flex;">
      <v-select
        chips
        style="width: 20%; margin-right: 1%;"
        label="Filter by Tags"
        v-model="filterTags"
        :items="tags.map(tag => tag.name)"
        multiple
      ></v-select>  
      <v-btn @click="clearFilters()">Clear Filters</v-btn>
    </div>
    <v-divider></v-divider>

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
                <v-img v-if="outfit.hat && outfit.hat.url" :src="outfit.hat.url" contain height="100px"></v-img>
              </v-col>
              <v-col cols="6">
                <v-img v-if="outfit.top && outfit.top.url" :src="outfit.top.url" contain height="100px"></v-img>
              </v-col>
              <v-col cols="6">
                <v-img v-if="outfit.bottom && outfit.bottom.url" :src="outfit.bottom.url" contain height="100px"></v-img>
              </v-col>
              <v-col cols="6">
                <v-img v-if="outfit.shoes && outfit.shoes.url" :src="outfit.shoes.url" contain height="100px"></v-img>
              </v-col>
              <v-col cols="12">
                <v-img v-if="outfit.accessory && outfit.accessory.url" :src="outfit.accessory.url" contain height="100px"></v-img>
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
            <v-btn prepend-icon="mdi-plus-box-outline" @click="openNewTagModal()">New Tag</v-btn>
            <v-select  
              v-model="editedOutfit.tags"
              :items="tags.map(tag => tag.name)"
              label="Tags"
              chips
              multiple>
            </v-select>
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
          <v-btn color="blue darken-1" text @click="saveEditedOutfit()">Save</v-btn>
          <v-btn color="grey darken-1" text @click="edit_outfit_dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- New Tag Dialog -->
    <v-dialog v-model="new_tag_dialog" max-width="400px">
      <v-card>
        <v-card-title>Create New Tag</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="newTag"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-btn @click="saveNewTag()">Save</v-btn>
      </v-card>
    </v-dialog>
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

      activeSlide: 0,
      user: null,
      loggedIn: false,
    }
  }, 
  mounted() {
    this.checkSession();
  },
  watch: {
    // watch tags filter
    'filterTags': function(newValue, oldValue) {
      if (newValue == ''){
        this.filteredOutfits = this.outfits
      } else {
        this.applyFilter()
      }
    }
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
      this.loadOutfits()
      this.loadImages()
      this.loadTags()
    },
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
        let images = []
        if (this.loggedIn) {
          images = await axios.get(`http://localhost:5000/api/images/${this.user.id}`); // change link to whatever it is
        } else {
          images = await axios.get(`http://localhost:5000/api/images`);
        }
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
        var outfits = []
        if (this.loggedIn) {
          outfits = await axios.get(`http://localhost:5000/api/outfits/account/${this.user.id}`); // change link to whatever it is
        } else {
          outfits = await axios.get(`http://localhost:5000/api/outfits`);
        }
        this.outfits = outfits.data
        this.filteredOutfits = outfits.data
      } catch (err) {
        console.error('Failed to load outfits:', err);
      }
    },
    async loadTags() {
      try {
        let tags = []
        if (this.loggedIn) {
          tags = await axios.get(`http://localhost:5000/api/tags/${this.user.id}`); // change link to whatever it is
        } else {
          tags = await axios.get(`http://localhost:5000/api/tags`);
        }
        this.tags = tags.data
      } catch (err) {
        console.error('Failed to load tags:', err);
      }
    },
    async deleteOutfit(id){
      try {
        await axios.delete(`http://localhost:5000/api/outfits/delete/${id}`)
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

        this.editedOutfit._id = this.editedOutfit._id
        this.editedOutfit.tags = this.editedOutfit.tags.map(tag => tagNameToIdMap[tag]._id)
        this.editedOutfit.account_id = this.user && this.user.id ? this.user.id : null

        if (this.editedOutfit.hat) {
          this.editedOutfit.hat = this.editedOutfit.hat._id
        }
        if (this.editedOutfit.top) {
          this.editedOutfit.top = this.editedOutfit.top._id
        }
        if (this.editedOutfit.bottom) {
          this.editedOutfit.bottom = this.editedOutfit.bottom._id
        }
        if (this.editedOutfit.shoes) {
          this.editedOutfit.shoes = this.editedOutfit.shoes._id
        }
        if (this.editedOutfit.accessory) {
          this.editedOutfit.accessory = this.editedOutfit.accessory._id
        }

        console.log(this.editedOutfit)
        
        await axios.put(`http://localhost:5000/api/outfits/edit/${this.editedOutfit._id}`, this.editedOutfit)
        this.loadOutfits()
        this.edit_outfit_dialog = false
      } catch (err) {
        console.log("Failed to save edited outfit: ", err)
      }
    },
    async saveNewTag() {
      try {
        const newTag = {name: this.newTag, account_id: this.user && this.user.id ? this.user.id : null}
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