<script setup>
// Reusable button primitive with strict visual variants.
defineProps({
  label: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'secondary'
  }
})
</script>

<template>
  <!-- Variant classes enforce one visual system for all call-to-action buttons. -->
  <button class="btn" :class="`btn--${variant}`" type="button">
    {{ label }}
  </button>
</template>
