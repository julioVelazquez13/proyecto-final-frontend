<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">✍️ Gestión de Autores</h1>
        <button class="btn btn-primary" @click="abrirFormularioNuevo">
          ➕ Nuevo Autor
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
        placeholder="Buscar autores por nombre o nacionalidad..."
      />

      <div v-if="cargando" class="loading">⏳ Cargando autores...</div>

      <div v-else>
        <p style="margin: 1rem 0;">
          Mostrando <strong>{{ autoresFiltrados.length }}</strong> autores
        </p>

        <ListaAutores
          :autores="autoresFiltrados"
          @editar="abrirFormularioEditar"
          @eliminar="eliminarAutor"
        />
      </div>
    </div>

    <Modal
      :visible="modalAbierto"
      :titulo="autorEditar ? 'Editar Autor' : 'Nuevo Autor'"
      @cerrar="cerrarModal"
    >
      <FormularioAutor
        :autor-editar="autorEditar"
        @guardar="guardarAutor"
        @cancelar="cerrarModal"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import autorService from '../services/autorService'
import ListaAutores from '../components/autores/ListaAutores.vue'
import FormularioAutor from '../components/autores/FormularioAutor.vue'
import Modal from '../components/Modal.vue'
import BuscadorBar from '../components/BuscadorBar.vue'

const autores = ref([])
const cargando = ref(true)
const modalAbierto = ref(false)
const autorEditar = ref(null)
const terminoBusqueda = ref('')
const mensaje = ref({ tipo: '', texto: '' })

const autoresFiltrados = computed(() => {
  if (!terminoBusqueda.value.trim()) return autores.value
  const termino = terminoBusqueda.value.toLowerCase()
  return autores.value.filter(a =>
    a.nombre.toLowerCase().includes(termino) ||
    a.nacionalidad.toLowerCase().includes(termino)
  )
})

onMounted(async () => {
  await cargarAutores()
})

const cargarAutores = async () => {
  cargando.value = true
  try {
    autores.value = await autorService.getAll()
  } catch (e) {
    mostrarMensaje('error', 'Error al cargar autores')
  } finally {
    cargando.value = false
  }
}

const abrirFormularioNuevo = () => {
  autorEditar.value = null
  modalAbierto.value = true
}

const abrirFormularioEditar = (autor) => {
  autorEditar.value = { ...autor }
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  autorEditar.value = null
}

const guardarAutor = async (datos) => {
  try {
    if (autorEditar.value) {
      const actualizado = await autorService.update(autorEditar.value.id, {
        ...datos,
        id: autorEditar.value.id
      })
      const idx = autores.value.findIndex(a => a.id === autorEditar.value.id)
      if (idx !== -1) autores.value[idx] = actualizado
      mostrarMensaje('success', '✅ Autor actualizado')
    } else {
      const nuevo = await autorService.create(datos)
      autores.value.push(nuevo)
      mostrarMensaje('success', '✅ Autor creado')
    }
    cerrarModal()
  } catch (e) {
    mostrarMensaje('error', 'Error al guardar autor')
  }
}

const eliminarAutor = async (id) => {
  try {
    await autorService.delete(id)
    autores.value = autores.value.filter(a => a.id !== id)
    mostrarMensaje('success', '🗑️ Autor eliminado')
  } catch (e) {
    mostrarMensaje('error', 'Error al eliminar autor')
  }
}

const mostrarMensaje = (tipo, texto) => {
  mensaje.value = { tipo, texto }
  setTimeout(() => {
    mensaje.value = { tipo: '', texto: '' }
  }, 3000)
}
</script>