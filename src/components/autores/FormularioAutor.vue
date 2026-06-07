<template>
  <form @submit.prevent="enviarFormulario">
    <div class="form-group">
      <label>Nombre completo *</label>
      <input
        type="text"
        class="form-control"
        :class="{ error: errores.nombre }"
        v-model="formulario.nombre"
      />
      <span v-if="errores.nombre" class="error-message">{{ errores.nombre }}</span>
    </div>

    <div class="form-group">
      <label>Nacionalidad *</label>
      <input
        type="text"
        class="form-control"
        :class="{ error: errores.nacionalidad }"
        v-model="formulario.nacionalidad"
      />
      <span v-if="errores.nacionalidad" class="error-message">{{ errores.nacionalidad }}</span>
    </div>

    <div class="form-group">
      <label>Fecha de nacimiento</label>
      <input type="date" class="form-control" v-model="formulario.fecha_nacimiento" />
    </div>

    <div v-if="edadAproximada" class="alert alert-info">
      Edad aproximada: {{ edadAproximada }} años
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="$emit('cancelar')">
        Cancelar
      </button>
      <button type="submit" class="btn btn-success" :disabled="!formularioValido">
        {{ autorEditar ? '💾 Actualizar' : '✅ Crear' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'

const props = defineProps({
  autorEditar: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['guardar', 'cancelar'])

const formulario = reactive({
  nombre: '',
  nacionalidad: '',
  fecha_nacimiento: ''
})

const errores = reactive({})

const formularioValido = computed(() => {
  return formulario.nombre.trim().length > 0 &&
         formulario.nacionalidad.trim().length > 0
})

const edadAproximada = computed(() => {
  if (!formulario.fecha_nacimiento) return null
  const nacimiento = new Date(formulario.fecha_nacimiento)
  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const m = hoy.getMonth() - nacimiento.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad >= 0 ? edad : null
})

onMounted(() => {
  if (props.autorEditar) {
    Object.assign(formulario, props.autorEditar)
  }
})

const validar = () => {
  Object.keys(errores).forEach(k => delete errores[k])
  if (!formulario.nombre.trim()) errores.nombre = 'El nombre es obligatorio'
  if (!formulario.nacionalidad.trim()) errores.nacionalidad = 'La nacionalidad es obligatoria'
  return Object.keys(errores).length === 0
}

const enviarFormulario = () => {
  if (!validar()) return
  emit('guardar', { ...formulario })
}
</script>