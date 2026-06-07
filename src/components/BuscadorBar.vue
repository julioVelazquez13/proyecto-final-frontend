<template>
  <div class="search-bar">
    <input
      type="text"
      class="form-control"
      :placeholder="placeholder"
      :value="modelValue"
      @input="actualizarBusqueda"
    />
    <button v-if="modelValue" class="btn btn-secondary" @click="limpiar">
      Limpiar
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  }
})

const emit = defineEmits(['update:modelValue', 'limpiar'])

const actualizarBusqueda = (event) => {
  emit('update:modelValue', event.target.value)
}

const limpiar = () => {
  emit('update:modelValue', '')
  emit('limpiar')
}
</script>