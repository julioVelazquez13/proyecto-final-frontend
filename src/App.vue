<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">📚 {{ titulo }}</div>

        <ul class="nav-links">
          <li v-for="link in navLinks" :key="link.path">
            <router-link :to="link.path">{{ link.nombre }}</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const titulo = ref('Biblioteca Virtual')

const navLinks = ref([
  { path: '/', nombre: '🏠 Inicio' },
  { path: '/libros', nombre: '📖 Libros' },
  { path: '/autores', nombre: '✍️ Autores' },
  { path: '/categorias', nombre: '🏷️ Categorías' }
])
</script>