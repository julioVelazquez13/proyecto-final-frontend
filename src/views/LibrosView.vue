<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">📚 Gestión de Libros</h1>
        <button class="btn btn-primary" @click="abrirFormularioNuevo">
          ➕ Nuevo Libro
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
        placeholder="Buscar libros por título, autor o categoría..."
      />

      <div class="search-bar">
        <select class="form-control" v-model.number="filtroCategoria">
          <option :value="0">Todas las categorías</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>
        <select class="form-control" v-model="filtroDisponibilidad">
          <option value="todos">Todos</option>
          <option value="disponibles">Solo disponibles</option>
          <option value="agotados">Solo agotados</option>
        </select>
      </div>

      <div v-if="cargando" class="loading">⏳ Cargando libros...</div>

      <div v-else>
        <p style="margin: 1rem 0;">
          Mostrando <strong>{{ librosFiltrados.length }}</strong> de
          <strong>{{ libros.length }}</strong> libros
        </p>

        <ListaLibros
          :libros="librosFiltrados"
          :autores="autores"
          :categorias="categorias"
          @editar="abrirFormularioEditar"
          @eliminar="eliminarLibro"
        />
      </div>
    </div>

    <Modal
      :visible="modalAbierto"
      :titulo="libroEditar ? 'Editar Libro' : 'Nuevo Libro'"
      @cerrar="cerrarModal"
    >
      <FormularioLibro
        :libro-editar="libroEditar"
        :autores="autores"
        :categorias="categorias"
        @guardar="guardarLibro"
        @cancelar="cerrarModal"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import libroService from '../services/libroService'
import autorService from '../services/autorService'
import categoriaService from '../services/categoriaService'
import ListaLibros from '../components/libros/ListaLibros.vue'
import FormularioLibro from '../components/libros/FormularioLibro.vue'
import Modal from '../components/Modal.vue'
import BuscadorBar from '../components/BuscadorBar.vue'

const libros = ref([])
const autores = ref([])
const categorias = ref([])
const cargando = ref(true)
const modalAbierto = ref(false)
const libroEditar = ref(null)
const terminoBusqueda = ref('')
const filtroCategoria = ref(0)
const filtroDisponibilidad = ref('todos')
const mensaje = ref({ tipo: '', texto: '' })

const librosFiltrados = computed(() => {
  let resultado = libros.value

  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.toLowerCase()
    resultado = resultado.filter(libro => {
      const autor = autores.value.find(a => a.id === libro.autor_id)
      const cat = categorias.value.find(c => c.id === libro.categoria_id)
      return libro.titulo.toLowerCase().includes(termino) ||
             (autor && autor.nombre.toLowerCase().includes(termino)) ||
             (cat && cat.nombre.toLowerCase().includes(termino))
    })
  }

  if (filtroCategoria.value > 0) {
    resultado = resultado.filter(l => l.categoria_id === filtroCategoria.value)
  }

  if (filtroDisponibilidad.value === 'disponibles') {
    resultado = resultado.filter(l => l.disponible)
  } else if (filtroDisponibilidad.value === 'agotados') {
    resultado = resultado.filter(l => !l.disponible)
  }

  return resultado
})

watch([filtroCategoria, filtroDisponibilidad], () => {
  if (libros.value.length > 0) {
    console.log('Filtros actualizados, libros mostrados:', librosFiltrados.value.length)
  }
})

onMounted(async () => {
  await cargarTodo()
})

const cargarTodo = async () => {
  cargando.value = true
  try {
    const [lbrs, auts, cats] = await Promise.all([
      libroService.getAll(),
      autorService.getAll(),
      categoriaService.getAll()
    ])
    libros.value = lbrs
    autores.value = auts
    categorias.value = cats
  } catch (e) {
    mostrarMensaje('error', 'Error al cargar datos')
  } finally {
    cargando.value = false
  }
}

const abrirFormularioNuevo = () => {
  libroEditar.value = null
  modalAbierto.value = true
}

const abrirFormularioEditar = (libro) => {
  libroEditar.value = { ...libro }
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  libroEditar.value = null
}

const guardarLibro = async (datos) => {
  try {
    if (libroEditar.value) {
      const actualizado = await libroService.update(libroEditar.value.id, {
        ...datos,
        id: libroEditar.value.id
      })
      const idx = libros.value.findIndex(l => l.id === libroEditar.value.id)
      if (idx !== -1) libros.value[idx] = actualizado
      mostrarMensaje('success', '✅ Libro actualizado correctamente')
    } else {
      const nuevo = await libroService.create(datos)
      libros.value.push(nuevo)
      mostrarMensaje('success', '✅ Libro creado correctamente')
    }
    cerrarModal()
  } catch (e) {
    mostrarMensaje('error', 'Error al guardar libro')
  }
}

const eliminarLibro = async (id) => {
  try {
    await libroService.delete(id)
    libros.value = libros.value.filter(l => l.id !== id)
    mostrarMensaje('success', '🗑️ Libro eliminado')
  } catch (e) {
    mostrarMensaje('error', 'Error al eliminar libro')
  }
}

const mostrarMensaje = (tipo, texto) => {
  mensaje.value = { tipo, texto }
  setTimeout(() => {
    mensaje.value = { tipo: '', texto: '' }
  }, 3000)
}
</script>