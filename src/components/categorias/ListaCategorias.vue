<template>
  <div>
    <div v-if="categorias.length === 0" class="empty-state">
      <h3>🏷️ No hay categorías registradas</h3>
    </div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="categoria in categorias" :key="categoria.id">
          <td><strong>{{ categoria.nombre }}</strong></td>
          <td>{{ categoria.descripcion }}</td>
          <td class="actions">
            <button class="btn btn-warning btn-sm" @click="$emit('editar', categoria)">
              ✏️ Editar
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmarEliminar(categoria)">
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
  categorias: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['editar', 'eliminar'])

const confirmarEliminar = (categoria) => {
  if (confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
    emit('eliminar', categoria.id)
  }
}
</script>