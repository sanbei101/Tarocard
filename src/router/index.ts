import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/components/Home.vue'
import TarotDeck from '@/components/TarotDeck.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tarodeck',
    name: 'TaroDeck',
    component: TarotDeck
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router