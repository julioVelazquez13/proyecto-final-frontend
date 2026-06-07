<template>
  <div v-if="visible" class="modal-overlay" @click.self="cerrar">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ titulo }}</h2>
        <button class="modal-close" @click="cerrar">✕</button>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  titulo: {
    type: String,
    default: 'Modal'
  }
})

const emit = defineEmits(['cerrar'])

const cerrar = () => {
  emit('cerrar')
}
</script>