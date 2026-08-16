<script setup>
// Learnings page provides a quick index of all tracked topic entries.
import BaseButton from '../components/BaseButton.vue'
import { RouterLink } from 'vue-router'
import { topics } from '../data/content'
</script>

<template>
  <!-- Route links lead users into detail pages for each topic. -->
  <section class="page">
    <div class="page__hero">
      <p class="eyebrow">Daily Learnings</p>
      <h2>Topic Timeline</h2>
      <p>Each topic maps to a dedicated detail page with highlights and outcomes.</p>
      <div class="page__actions">
        <BaseButton label="Filter by Category" variant="secondary" />
      </div>
    </div>

    <div class="timeline">
      <RouterLink v-for="topic in topics" :key="topic.id" class="timeline__item" :to="`/topic/${topic.id}`">
        <p class="timeline__meta">Day {{ topic.day }} • {{ topic.category }}</p>
        <h3>{{ topic.title }}</h3>
        <p>{{ topic.outcome }}</p>
      </RouterLink>
    </div>
  </section>
</template>
