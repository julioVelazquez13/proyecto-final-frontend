<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">🏷️ Gestión de Categorías</h1>
        <button class="btn btn-primary" @click="abrirFormularioNuevo">
          ➕ Nueva Categoría
        </button>
      </div>

      <div v-if="mensaje.tipo === 'success'" class="alert alert-success">
        {{ mensaje.texto }}
      </div>
      <div v-else-if="mensaje.tipo === 'error'" class="alert alert-error">
        {{ mensaje.texto }}
      </div>

      <BuscadorBar
        v-model="terminoBusqueda"
        placeholder="Buscar categorías..."
      />

      <div v-if="cargando" class="loading">⏳ Cargando categorías...</div>

      <div v-else>
        <p style="margin: 1rem 0;">
          Mostrando <strong>{{ categoriasFiltradas.length }}</strong> categorías
        </p>

        <ListaCategorias
          :categorias="categoriasFiltradas"
          @editar="abrirFormularioEditar"
          @eliminar="eliminarCategoria"
        />
      </div>
    </div>

    <Modal
      :visible="modalAbierto"
      :titulo="categoriaEditar ? 'Editar Categoría' : 'Nueva Categoría'"
      @cerrar="cerrarModal"
    >
      <FormularioCategoria
        :categoria-editar="categoriaEditar"
        @guardar="guardarCategoria"
        @cancelar="cerrarModal"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import categoriaService from '../services/categoriaService'
import ListaCategorias from '../components/categorias/ListaCategorias.vue'
import FormularioCategoria from '../components/categorias/FormularioCategoria.vue'
import Modal from '../components/Modal.vue'
import BuscadorBar from '../components/BuscadorBar.vue'

const categorias = ref([])
const cargando = ref(true)
const modalAbierto = ref(false)
const categoriaEditar = ref(null)
const terminoBusqueda = ref('')
const mensaje = ref({ tipo: '', texto: '' })

const categoriasFiltradas = computed(() => {
  if (!terminoBusqueda.value.trim()) return categorias.value
  const termino = terminoBusqueda.value.toLowerCase()
  return categorias.value.filter(c =>
    c.nombre.toLowerCase().includes(termino) ||
    c.descripcion.toLowerCase().includes(termino)
  )
})

onMounted(async () => {
  await cargarCategorias()
})

const cargarCategorias = async () => {
  cargando.value = true
  try {
    categorias.value = await categoriaService.getAll()
  } catch (e) {
    mostrarMensaje('error', 'Error al cargar categorías')
  } finally {
    cargando.value = false
  }
}

const abrirFormularioNuevo = () => {
  categoriaEditar.value = null
  modalAbierto.value = true
}

const abrirFormularioEditar = (cat) => {
  categoriaEditar.value = { ...cat }
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  categoriaEditar.value = null
}

const guardarCategoria = async (datos) => {
  try {
    if (categoriaEditar.value) {
      const actualizada = await categoriaService.update(categoriaEditar.value.id, {
        ...datos,
        id: categoriaEditar.value.id
      })
      const idx = categorias.value.findIndex(c => c.id === categoriaEditar.value.id)
      if (idx !== -1) categorias.value[idx] = actualizada
      mostrarMensaje('success', '✅ Categoría actualizada')
    } else {
      const nueva = await categoriaService.create(datos)
      categorias.value.push(nueva)
      mostrarMensaje('success', '✅ Categoría creada')
    }
    cerrarModal()
  } catch (e) {
    mostrarMensaje('error', 'Error al guardar categoría')
  }
}

const eliminarCategoria = async (id) => {
  try {
    await categoriaService.delete(id)
    categorias.value = categorias.value.filter(c => c.id !== id)
    mostrarMensaje('success', '🗑️ Categoría eliminada')
  } catch (e) {
    mostrarMensaje('error', 'Error al eliminar categoría')
  }
}

const mostrarMensaje = (tipo, texto) => {
  mensaje.value = { tipo, texto }
  setTimeout(() => {
    mensaje.value = { tipo: '', texto: '' }
  }, 3000)
}
</script>