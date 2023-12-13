import { createRouter, createWebHistory } from 'vue-router'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/dashboard.vue'),
      
      
    },
    {
        path: '/maze',
        component: () => import('../views/maze.vue'),
        
        
      },
    
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

export default router
