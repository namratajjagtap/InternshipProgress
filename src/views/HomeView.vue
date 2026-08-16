<script setup>
// Home page summarizes internship progress and acts as landing overview.
import BaseButton from '../components/BaseButton.vue'
import InfoCard from '../components/InfoCard.vue'
import { internshipMeta, topics } from '../data/content'

const recentTopics = topics.slice(0, 3)
</script>

<template>
  <!-- Home is the only page that contains a primary action button. -->
  <section class="page">
    <div class="page__hero">
      <p class="eyebrow">Internship Overview</p>
      <h2>{{ internshipMeta.title }}</h2>
      <p>{{ internshipMeta.summary }}</p>
      <div class="page__actions">
        <BaseButton label="View Progress Snapshot" variant="primary" />
      </div>
    </div>

    <div class="card-grid">
      <InfoCard title="Days Completed" :meta="`${internshipMeta.daysCompleted} days`">
        <p>Consistent learning progress with practical coding work and feedback loops.</p>
      </InfoCard>

      <InfoCard title="Current Role" :meta="internshipMeta.role">
        <p>Focused on building maintainable UI with Vue.js and clean project structure.</p>
      </InfoCard>

      <InfoCard title="Recent Topics" meta="Last 3 learning entries">
        <ul class="clean-list">
          <li v-for="topic in recentTopics" :key="topic.id">{{ topic.title }}</li>
        </ul>
      </InfoCard>
    </div>
  </section>
</template>
