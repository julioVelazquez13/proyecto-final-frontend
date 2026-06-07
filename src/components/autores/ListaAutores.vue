<template>
  <div>
    <div v-if="autores.length === 0" class="empty-state">
      <h3>✍️ No hay autores registrados</h3>
    </div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Nacionalidad</th>
          <th>Fecha de Nacimiento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="autor in autores" :key="autor.id">
          <td>{{ autor.nombre }}</td>
          <td>{{ autor.nacionalidad }}</td>
          <td>{{ formatearFecha(autor.fecha_nacimiento) }}</td>
          <td class="actions">
            <button class="btn btn-warning btn-sm" @click="$emit('editar', autor)">
              ✏️ Editar
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmarEliminar(autor)">
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
  autores: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['editar', 'eliminar'])

const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A'
  const f = new Date(fecha)
  return f.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
}

const confirmarEliminar = (autor) => {
  if (confirm(`¿Eliminar al autor "${autor.nombre}"?`)) {
    emit('eliminar', autor.id)
  }
}
</script>