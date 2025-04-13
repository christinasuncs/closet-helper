import { createRouter, createWebHistory } from 'vue-router';
import OutfitsView from '../components/Outfits.vue';
import OutfitGeneratorView from '../components/OutfitGenerator.vue';
import ClosetView from '../components/Closet.vue';

const routes = [
  {
    path: '/',
    name: 'OutfitGeneratorView',
    component: OutfitGeneratorView,
  },
  {
    path: '/outfits',
    name: 'OutfitsView',
    component: OutfitsView,
  },
  {
    path: '/closet',
    name: 'ClosetView',
    component: ClosetView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;