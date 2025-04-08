import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/components/Home.vue';
import TaroDeck from '@/components/TaroDeck.vue';
export const RouteNames = {
  Home: 'Home',
  TaroDeck: 'TaroDeck'
};
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tarodeck',
    name: 'TaroDeck',
    component: TaroDeck
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
