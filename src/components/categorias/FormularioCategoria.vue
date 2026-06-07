<template>
  <form @submit.prevent="enviarFormulario">
    <div class="form-group">
      <label>Nombre *</label>
      <input
        type="text"
        class="form-control"
        :class="{ error: errores.nombre }"
        v-model="formulario.nombre"
      />
      <span v-if="errores.nombre" class="error-message">{{ errores.nombre }}</span>
    </div>

    <div class="form-group">
      <label>Descripción *</label>
      <textarea
        class="form-control"
        rows="4"
        :class="{ error: errores.descripcion }"
        v-model="formulario.descripcion"
      ></textarea>
      <span v-if="errores.descripcion" class="error-message">{{ errores.descripcion }}</span>
    </div>

    <div class="alert alert-info">
      Caracteres en descripción: {{ contadorCaracteres }}
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="$emit('cancelar')">
        Cancelar
      </button>
      <button type="submit" class="btn btn-success" :disabled="!formularioValido">
        {{ categoriaEditar ? '💾 Actualizar' : '✅ Crear' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'

const props = defineProps({
  categoriaEditar: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['guardar', 'cancelar'])

const formulario = reactive({
  nombre: '',
  descripcion: ''
})

const errores = reactive({})

const formularioValido = computed(() => {
  return formulario.nombre.trim().length > 0 &&
         formulario.descripcion.trim().length > 0
})

const contadorCaracteres = computed(() => formulario.descripcion.length)

onMounted(() => {
  if (props.categoriaEditar) {
    Object.assign(formulario, props.categoriaEditar)
  }
})

const validar = () => {
  Object.keys(errores).forEach(k => delete errores[k])
  if (!formulario.nombre.trim()) errores.nombre = 'El nombre es obligatorio'
  if (!formulario.descripcion.trim()) errores.descripcion = 'La descripción es obligatoria'
  return Object.keys(errores).length === 0
}

const enviarFormulario = () => {
  if (!validar()) return
  emit('guardar', { ...formulario })
}
</script>