<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../components/BaseButton.vue'
import { useTopics } from '../composables/useTopics'

const router = useRouter()
const { addTopic } = useTopics()

const form = reactive({
  title: '',
  category: '',
  highlightsText: '',
  outcome: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

function resetForm() {
  form.title = ''
  form.category = ''
  form.highlightsText = ''
  form.outcome = ''
}

async function submitTopic() {
  const highlights = form.highlightsText
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  if (!form.title.trim() || !form.category.trim() || !form.outcome.trim() || highlights.length === 0) {
    errorMessage.value = 'Please fill title, category, outcome, and at least one highlight.'
    successMessage.value = ''
    return
  }

  try {
    isSubmitting.value = true

    const createdTopic = await addTopic({
      title: form.title,
      category: form.category,
      highlights,
      outcome: form.outcome
    })

    errorMessage.value = ''
    successMessage.value = 'Topic added successfully. Opening topic details...'
    resetForm()
    setTimeout(() => {
      router.push(`/${createdTopic.id}`)
    }, 800)
  } catch (error) {
    successMessage.value = ''
    errorMessage.value = error instanceof Error ? error.message : 'Failed to save topic.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="page">
    <div class="page__hero">
      <p class="eyebrow">Learning Topics</p>
      <h2>Add Topic</h2>
      <p>Add a new learning topic and save it permanently through the API.</p>
    </div>

    <article class="detail-card">
      <form class="topic-form" @submit.prevent="submitTopic">
        <label class="topic-form__field">
          <span>Title</span>
          <input v-model="form.title" type="text" placeholder="Example: Vue State Management" />
        </label>

        <label class="topic-form__field">
          <span>Category</span>
          <input v-model="form.category" type="text" placeholder="Example: Vue.js" />
        </label>

        <label class="topic-form__field">
          <span>Highlights (one point per line)</span>
          <textarea
            v-model="form.highlightsText"
            rows="5"
            placeholder="ref and reactive basics&#10;computed and derived state&#10;when to use watch"
          />
        </label>

        <label class="topic-form__field">
          <span>Outcome</span>
          <textarea
            v-model="form.outcome"
            rows="4"
            placeholder="Describe what you built or learned from this topic"
          />
        </label>

        <p v-if="errorMessage" class="topic-form__error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="topic-form__success">{{ successMessage }}</p>

        <div class="page__actions">
          <BaseButton label="Save Topic" variant="primary" button-type="submit" />
          <p v-if="isSubmitting" class="topic-form__saving">Saving topic...</p>
        </div>
      </form>
    </article>
  </section>
</template>
