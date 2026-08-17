<script setup>
// Sidebar links include both top-level pages and detailed learning topics.
import { RouterLink } from 'vue-router'

defineProps({
  topics: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <!-- Collapsible side panel with route-aware links for navigation. -->
  <nav class="side-nav" aria-label="Internship navigation">
    <p class="side-nav__heading">Main Sections</p>
    <RouterLink class="side-nav__link" to="/">Home</RouterLink>
    <RouterLink class="side-nav__link" to="/about">About Me</RouterLink>
    <RouterLink class="side-nav__link" to="/trainings">Trainings</RouterLink>
    <RouterLink class="side-nav__link" to="/add-topic">Add Topic</RouterLink>

    <p class="side-nav__heading side-nav__heading--topics">Learning Topics</p>
    <RouterLink
      v-for="topic in topics"
      :key="topic.id"
      class="side-nav__topic"
      :to="`/topic/${topic.id}`"
    >
      {{ topic.title }}
    </RouterLink>
  </nav>
</template>
