<script setup>
// Generic card wrapper used across overview, trainings, and task sections.
defineProps({
  title: {
    type: String,
    required: true
  },
  meta: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <!-- Slot-based card keeps visual consistency and content flexibility. -->
  <article class="info-card">
    <header class="info-card__header">
      <h3>{{ title }}</h3>
      <p v-if="meta" class="info-card__meta">{{ meta }}</p>
    </header>
    <div class="info-card__body">
      <slot />
    </div>
  </article>
</template>
