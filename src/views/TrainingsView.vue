<script setup>
// Trainings page lists formal sessions and key points learned.
import BaseButton from '../components/BaseButton.vue'
import InfoCard from '../components/InfoCard.vue'
import { trainings } from '../data/content'
</script>

<template>
  <!-- Uses secondary button variant to keep primary button unique to Home page. -->
  <section class="page">
    <div class="page__hero">
      <p class="eyebrow">Trainings</p>
      <h2>Structured Learning Sessions</h2>
      <p>Track organized workshops and the most useful points captured from each one.</p>
      <div class="page__actions">
        <BaseButton label="Export Training Notes" variant="secondary" />
      </div>
    </div>

    <div class="card-grid">
      <InfoCard
        v-for="training in trainings"
        :key="training.name"
        :title="training.name"
        :meta="training.date"
      >
        <ul class="clean-list">
          <li v-for="point in training.keyPoints" :key="point">{{ point }}</li>
        </ul>
      </InfoCard>
    </div>
  </section>
</template>
