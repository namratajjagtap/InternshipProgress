<script setup>
// Dynamic topic page resolves details from route param and shared topic data.
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import BaseButton from '../components/BaseButton.vue'
import { useTopics } from '../composables/useTopics'

const route = useRoute()
const router = useRouter()
const { topics, isLoadingTopics, ensureLoaded, deleteTopic } = useTopics()
const deleteError = ref('')
const isDeleting = ref(false)

const topic = computed(() => topics.value.find((item) => item.id === route.params.id))

onMounted(() => {
  ensureLoaded()
})

async function handleDeleteTopic() {
  if (!topic.value) {
    return
  }

  const confirmed = window.confirm(`Delete topic "${topic.value.title}"?`)
  if (!confirmed) {
    return
  }

  try {
    isDeleting.value = true
    deleteError.value = ''
    await deleteTopic(topic.value.id)
    router.push('/')
  } catch (error) {
    deleteError.value = error instanceof Error ? error.message : 'Failed to delete topic.'
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <!-- Fallback state protects route from unknown topic ids. -->
  <section class="page">
    <article v-if="isLoadingTopics" class="detail-card">
      <h3>Loading Topic...</h3>
      <p>Please wait while we fetch the latest topic data.</p>
    </article>

    <template v-if="topic">
      <div class="page__hero">
        <p class="eyebrow">Topic Details</p>
        <h2>{{ topic.title }}</h2>
        <p>{{ topic.category }} • Day {{ topic.day }}</p>
        <div class="page__actions">
          <BaseButton label="Mark as Reviewed" variant="secondary" />
          <BaseButton
            :label="isDeleting ? 'Deleting...' : 'Delete Topic'"
            variant="danger"
            :disabled="isDeleting"
            @click="handleDeleteTopic"
          />
        </div>
        <p v-if="deleteError" class="topic-form__error">{{ deleteError }}</p>
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
      <RouterLink class="side-nav__link" to="/add-topic">Add a New Topic</RouterLink>
    </article>
  </section>
</template>
