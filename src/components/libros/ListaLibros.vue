<template>
  <div>
    <div v-if="libros.length === 0" class="empty-state">
      <h3>📚 No hay libros registrados</h3>
      <p>Haz clic en "Nuevo Libro" para empezar</p>
    </div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Autor</th>
          <th>Categoría</th>
          <th>Año</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="libro in libros" :key="libro.id">
          <td>{{ libro.titulo }}</td>
          <td>{{ obtenerNombreAutor(libro.autor_id) }}</td>
          <td>{{ obtenerNombreCategoria(libro.categoria_id) }}</td>
          <td>{{ libro.anio }}</td>
          <td>{{ libro.stock }}</td>
          <td>
            <span
              class="badge"
              :class="libro.disponible ? 'badge-success' : 'badge-danger'"
            >
              {{ libro.disponible ? 'Disponible' : 'No disponible' }}
            </span>
          </td>
          <td class="actions">
            <button class="btn btn-warning btn-sm" @click="$emit('editar', libro)">
              ✏️ Editar
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmarEliminar(libro)">
              🗑️ Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  libros: {
    type: Array,
    required: true,
    default: () => []
  },
  autores: {
    type: Array,
    required: true,
    default: () => []
  },
  categorias: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['editar', 'eliminar'])

const obtenerNombreAutor = (autorId) => {
  const autor = props.autores.find(a => a.id === autorId)
  return autor ? autor.nombre : 'Sin autor'
}

const obtenerNombreCategoria = (categoriaId) => {
  const categoria = props.categorias.find(c => c.id === categoriaId)
  return categoria ? categoria.nombre : 'Sin categoría'
}

const confirmarEliminar = (libro) => {
  if (confirm(`¿Eliminar el libro "${libro.titulo}"?`)) {
    emit('eliminar', libro.id)
  }
}
</script>