import { createRouter, createWebHistory } from 'vue-router';
import ClosetView from '../components/Closet.vue';
import OutfitGeneratorView from '../components/OutfitGenerator.vue';

const routes = [
  {
    path: '/',
    name: 'OutfitGeneratorView',
    component: OutfitGeneratorView,
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