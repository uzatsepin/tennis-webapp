import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home' },
    },
    {
      path: '/rankings',
      name: 'rankings',
      component: () => import('../views/RankingsView.vue'),
      meta: { title: 'Rankings' },
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../views/GamesView.vue'),
      meta: { title: 'Games' },
    },
    {
      path: '/games/new',
      name: 'new-game',
      component: () => import('../views/NewGameView.vue'),
      meta: { title: 'New Game' },
    },
    {
      path: '/games/:id',
      name: 'game-detail',
      component: () => import('../views/GameDetailView.vue'),
      meta: { title: 'Game Details' },
    },
    {
      path: '/games/:id/result',
      name: 'record-result',
      component: () => import('../views/RecordResultView.vue'),
      meta: { title: 'Record Result' },
    },
    {
      path: '/profile/:id',
      name: 'player-profile',
      component: () => import('../views/PlayerProfileView.vue'),
      meta: { title: 'Player Profile' },
    },
    {
      path: '/profile',
      name: 'my-profile',
      component: () => import('../views/MyProfileView.vue'),
      meta: { title: 'My Profile' },
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'Tennis Club'}`
  next()
})

export default router
