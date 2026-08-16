<script setup>
// Dynamic topic page resolves details from route param and shared topic data.
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '../components/BaseButton.vue'
import { topics } from '../data/content'

const route = useRoute()

const topic = computed(() => topics.find((item) => item.id === route.params.id))
</script>

<template>
  <!-- Fallback state protects route from unknown topic ids. -->
  <section class="page">
    <template v-if="topic">
      <div class="page__hero">
        <p class="eyebrow">Topic Details</p>
        <h2>{{ topic.title }}</h2>
        <p>{{ topic.category }} • Day {{ topic.day }}</p>
        <div class="page__actions">
          <BaseButton label="Mark as Reviewed" variant="secondary" />
        </div>
      </div>

      <article class="detail-card">
        <h3>Highlights</h3>
        <ul class="clean-list">
          <li v-for="highlight in topic.highlights" :key="highlight">{{ highlight }}</li>
        </ul>

        <h3>Outcome</h3>
        <p>{{ topic.outcome }}</p>
      </article>
    </template>

    <article v-else class="detail-card">
      <h3>Topic Not Found</h3>
      <p>The selected topic does not exist in the current dataset.</p>
      <BaseButton label="Back to Learning Topics" variant="secondary" />
    </article>
  </section>
</template>
