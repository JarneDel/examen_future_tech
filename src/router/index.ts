import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/dashboard.vue'),
    },
    {
      path: '/onboarding',
      component: () => import('../views/onboarding.vue'),
    },

    {
      path: '/firestore',
      component: () => import('../views/Firestore.vue'),
    },

    {
      path: '/catch-game',
      component: () => import('../views/CatchGame.vue'),
    },

    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

export default router
