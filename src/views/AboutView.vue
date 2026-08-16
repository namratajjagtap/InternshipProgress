<script setup>
// About page introduces intern profile and background context.
import BaseButton from '../components/BaseButton.vue'
</script>

<template>
  <!-- Secondary action style is intentionally used to preserve one-page primary rule. -->
  <section class="page">
    <div class="page__hero">
      <p class="eyebrow">About Me</p>
      <h2>Your Name</h2>
      <p>
        Final-year student passionate about frontend development, scalable UI systems,
        and product-focused problem solving.
      </p>
      <div class="page__actions">
        <BaseButton label="Download Profile Summary" variant="secondary" />
      </div>
    </div>

    <div class="card-grid card-grid--two">
      <article class="mini-panel">
        <h3>Background</h3>
        <p>College: NIT Silchar, Assam</p>
        <p>Domain: Web Development</p>
      </article>
      <article class="mini-panel">
        <h3>Internship Role</h3>
        <p>Role: Apprentice</p>
        <p>Focus: Vue.js components, routing, and responsive UI behavior.</p>
      </article>
    </div>
  </section>
</template>
