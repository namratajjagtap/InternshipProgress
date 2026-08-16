<script setup>
// Header receives sidebar state and emits toggle requests to parent layout.
defineProps({
  pageTitle: {
    type: String,
    required: true
  },
  isSidebarOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggle-sidebar'])

function toggleSidebar() {
  emit('toggle-sidebar')
}
</script>

<template>
  <!-- Top navigation keeps app identity and global navigation controls. -->
  <header class="top-nav">
    <button class="icon-toggle" type="button" @click="toggleSidebar">
      {{ isSidebarOpen ? 'Hide Topics' : 'Show Topics' }}
    </button>

    <h1 class="top-nav__title">{{ pageTitle }}</h1>

    <div class="top-nav__brand">
      <p class="top-nav__site">Internship Progress </p>
      <p class="top-nav__role">Portfolio by Namrata Jagtap (DES DOS SW CP)</p>
    </div>


  
  </header>
</template>
