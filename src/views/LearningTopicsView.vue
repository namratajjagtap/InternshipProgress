<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTopics } from '../composables/useTopics'

const { topics } = useTopics()

const sortedTopics = computed(() => {
  return [...topics.value].sort((a, b) => Number(a.day ?? 0) - Number(b.day ?? 0))
})
</script>

<template>
  <section class="page">
    <div class="page__hero">
      <p class="eyebrow">Learning Topics</p>
      <h2>Learning Topics</h2>
      <p>Browse the major topics you have explored during the internship.</p>

      <div class="page__actions">
        <RouterLink class="btn btn--primary" to="/add-topic">Add Topic</RouterLink>
      </div>
    </div>

    <div class="card-grid">
      <article v-for="topic in sortedTopics" :key="topic.id" class="info-card">
        <header class="info-card__header">
          <h3>{{ topic.title }}</h3>
          <p class="info-card__meta">{{ topic.category }}</p>
        </header>

        <div class="info-card__body">
          <p>{{ topic.outcome }}</p>
          <div class="topic-preview__tags">
            <span v-for="highlight in topic.highlights.slice(0, 3)" :key="highlight">{{ highlight }}</span>
          </div>
          <RouterLink class="btn btn--secondary" :to="`/${topic.id}`">View Details</RouterLink>
        </div>
      </article>
    </div>

    <p v-if="sortedTopics.length === 0" class="empty-state">
      No learning topics yet. Use the Add Topic button to create the first one.
    </p>
  </section>
</template>
