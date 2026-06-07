import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LibrosView from '../views/LibrosView.vue'
import AutoresView from '../views/AutoresView.vue'
import CategoriasView from '../views/CategoriasView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/libros',
    name: 'libros',
    component: LibrosView
  },
  {
    path: '/autores',
    name: 'autores',
    component: AutoresView
  },
  {
    path: '/categorias',
    name: 'categorias',
    component: CategoriasView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router