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
  },
  buttonType: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <!-- Variant classes enforce one visual system for all call-to-action buttons. -->
  <button class="btn" :class="`btn--${variant}`" :type="buttonType" :disabled="disabled">
    {{ label }}
  </button>
</template>
