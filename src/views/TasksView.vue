<script setup>
// Tasks page displays practical mini-assignments and measurable outcomes.
import BaseButton from '../components/BaseButton.vue'
import InfoCard from '../components/InfoCard.vue'
import { smallTasks } from '../data/content'
</script>

<template>
  <!-- Tasks also use secondary button style for visual hierarchy consistency. -->
  <section class="page">
    <div class="page__hero">
      <p class="eyebrow">Small Tasks</p>
      <h2>Practical Work Completed</h2>
      <p>Small deliverables that improved the product and strengthened core skills.</p>
      <div class="page__actions">
        <BaseButton label="Generate Task Report" variant="secondary" />
      </div>
    </div>

    <div class="card-grid">
      <InfoCard
        v-for="task in smallTasks"
        :key="task.title"
        :title="task.title"
        meta="Execution + Outcome"
      >
        <p><strong>What I did:</strong> {{ task.whatIDid }}</p>
        <p><strong>Outcome:</strong> {{ task.outcome }}</p>
      </InfoCard>
    </div>
  </section>
</template>
