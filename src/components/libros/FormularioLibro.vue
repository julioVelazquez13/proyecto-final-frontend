<template>
  <form @submit.prevent="enviarFormulario">
    <div class="form-group">
      <label>Título *</label>
      <input
        type="text"
        class="form-control"
        :class="{ error: errores.titulo }"
        v-model="formulario.titulo"
      />
      <span v-if="errores.titulo" class="error-message">{{ errores.titulo }}</span>
    </div>

    <div class="form-group">
      <label>Autor *</label>
      <select
        class="form-control"
        :class="{ error: errores.autor_id }"
        v-model.number="formulario.autor_id"
      >
        <option :value="0">-- Selecciona un autor --</option>
        <option v-for="autor in autores" :key="autor.id" :value="autor.id">
          {{ autor.nombre }}
        </option>
      </select>
      <span v-if="errores.autor_id" class="error-message">{{ errores.autor_id }}</span>
    </div>

    <div class="form-group">
      <label>Categoría *</label>
      <select
        class="form-control"
        :class="{ error: errores.categoria_id }"
        v-model.number="formulario.categoria_id"
      >
        <option :value="0">-- Selecciona una categoría --</option>
        <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
          {{ cat.nombre }}
        </option>
      </select>
      <span v-if="errores.categoria_id" class="error-message">{{ errores.categoria_id }}</span>
    </div>

    <div class="form-group">
      <label>ISBN</label>
      <input type="text" class="form-control" v-model="formulario.isbn" />
    </div>

    <div class="form-group">
      <label>Año *</label>
      <input
        type="number"
        class="form-control"
        :class="{ error: errores.anio }"
        v-model.number="formulario.anio"
      />
      <span v-if="errores.anio" class="error-message">{{ errores.anio }}</span>
    </div>

    <div class="form-group">
      <label>Stock</label>
      <input
        type="number"
        class="form-control"
        v-model.number="formulario.stock"
        min="0"
      />
    </div>

    <div class="form-group">
      <label>
        <input type="checkbox" v-model="formulario.disponible" />
        Disponible para préstamo
      </label>
    </div>

    <div v-if="resumenFormulario" class="alert alert-info">
      {{ resumenFormulario }}
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="$emit('cancelar')">
        Cancelar
      </button>
      <button type="submit" class="btn btn-success" :disabled="!formularioValido">
        {{ libroEditar ? '💾 Actualizar' : '✅ Crear' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

const props = defineProps({
  libroEditar: {
    type: Object,
    default: null
  },
  autores: {
    type: Array,
    required: true
  },
  categorias: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['guardar', 'cancelar'])

const formulario = reactive({
  titulo: '',
  autor_id: 0,
  categoria_id: 0,
  isbn: '',
  anio: new Date().getFullYear(),
  stock: 1,
  disponible: true
})

const errores = reactive({})

const formularioValido = computed(() => {
  return formulario.titulo.trim().length > 0 &&
         formulario.autor_id > 0 &&
         formulario.categoria_id > 0 &&
         formulario.anio > 0
})

const resumenFormulario = computed(() => {
  if (!formulario.titulo) return ''
  return `Vas a guardar: "${formulario.titulo}" (${formulario.anio}) - Stock: ${formulario.stock}`
})

watch(() => formulario.stock, (nuevoStock) => {
  if (nuevoStock === 0) {
    formulario.disponible = false
  } else if (nuevoStock > 0 && !formulario.disponible) {
    formulario.disponible = true
  }
})

onMounted(() => {
  if (props.libroEditar) {
    Object.assign(formulario, props.libroEditar)
  }
})

const validar = () => {
  Object.keys(errores).forEach(k => delete errores[k])

  if (!formulario.titulo.trim()) {
    errores.titulo = 'El título es obligatorio'
  }
  if (!formulario.autor_id) {
    errores.autor_id = 'Selecciona un autor'
  }
  if (!formulario.categoria_id) {
    errores.categoria_id = 'Selecciona una categoría'
  }
  if (!formulario.anio || formulario.anio < 1) {
    errores.anio = 'El año debe ser válido'
  }

  return Object.keys(errores).length === 0
}

const enviarFormulario = () => {
  if (!validar()) return
  emit('guardar', { ...formulario })
}
</script>