<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">📊 Dashboard - Biblioteca Virtual</h1>
      </div>

      <p>Bienvenido al sistema de gestión de biblioteca. Aquí puedes ver un resumen general.</p>
    </div>

    <div v-if="cargando" class="loading">⏳ Cargando estadísticas...</div>

    <div v-else>
      <div class="stats-grid">
        <div v-for="stat in estadisticas" :key="stat.label" class="stat-card">
          <div class="stat-number">{{ stat.valor }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <div class="card">
        <h2>📚 Últimos libros agregados</h2>
        <ul style="list-style: none; padding-top: 1rem;">
          <li
            v-for="libro in librosRecientes"
            :key="libro.id"
            style="padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0;"
          >
            <strong>{{ libro.titulo }}</strong>
            <span v-if="libro.disponible" class="badge badge-success" style="margin-left: 1rem;">
              Disponible
            </span>
            <span v-else class="badge badge-danger" style="margin-left: 1rem;">
              Agotado
            </span>
          </li>
        </ul>
      </div>

      <div class="card">
        <h2>🏷️ Libros por categoría</h2>
        <div v-if="distribucionCategorias.length === 0" class="empty-state">
          No hay datos
        </div>
        <ul v-else style="list-style: none; padding-top: 1rem;">
          <li
            v-for="item in distribucionCategorias"
            :key="item.categoria"
            style="padding: 0.5rem 0;"
          >
            {{ item.categoria }}: <strong>{{ item.cantidad }} libros</strong>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import libroService from '../services/libroService'
import autorService from '../services/autorService'
import categoriaService from '../services/categoriaService'

const libros = ref([])
const autores = ref([])
const categorias = ref([])
const cargando = ref(true)

const estadisticas = computed(() => [
  { label: 'Total Libros', valor: libros.value.length },
  { label: 'Total Autores', valor: autores.value.length },
  { label: 'Total Categorías', valor: categorias.value.length },
  {
    label: 'Libros Disponibles',
    valor: libros.value.filter(l => l.disponible).length
  },
  {
    label: 'Stock Total',
    valor: libros.value.reduce((sum, l) => sum + (l.stock || 0), 0)
  }
])

const librosRecientes = computed(() => {
  return [...libros.value]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
})

const distribucionCategorias = computed(() => {
  return categorias.value.map(cat => ({
    categoria: cat.nombre,
    cantidad: libros.value.filter(l => l.categoria_id === cat.id).length
  })).filter(item => item.cantidad > 0)
})

onMounted(async () => {
  try {
    const [libsData, autsData, catsData] = await Promise.all([
      libroService.getAll(),
      autorService.getAll(),
      categoriaService.getAll()
    ])
    libros.value = libsData
    autores.value = autsData
    categorias.value = catsData
  } catch (error) {
    console.error('Error cargando datos:', error)
    alert('Error al cargar datos. ¿Está corriendo json-server en el puerto 3000?')
  } finally {
    cargando.value = false
  }
})
</script>