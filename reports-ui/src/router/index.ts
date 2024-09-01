import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TryDx from '../views/TryDx.vue'
import PivotGrid from '../views/pivot/PivotGrid.vue'
import Reports from '../reports/components/Reports.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/try',
      name: 'try',
      component: TryDx
    },
    {
      path: '/pivot',
      name: 'pivot',
      component: PivotGrid
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
