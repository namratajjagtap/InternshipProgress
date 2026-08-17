import { computed, ref } from 'vue'

const DEFAULT_API_BASE_URL = 'https://14vstcuv5i.execute-api.ap-south-1.amazonaws.com'
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '')
const topicsState = ref([])
const isLoadingState = ref(false)
const loadErrorState = ref('')
let initialized = false
let initPromise = null

function isValidTopic(candidate) {
  return (
    candidate &&
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.category === 'string' &&
    Array.isArray(candidate.highlights) &&
    typeof candidate.outcome === 'string'
  )
}

function getNextDay(topics) {
  const maxDay = topics.reduce((max, topic) => {
    const value = Number(topic.day)
    return Number.isFinite(value) ? Math.max(max, value) : max
  }, 0)

  return maxDay + 1
}

function normalizeTopic(topic, fallbackDay) {
  return {
    ...topic,
    day: Number.isFinite(Number(topic.day)) ? Number(topic.day) : fallbackDay
  }
}

function getTopicsEndpoint() {
  if (!API_BASE_URL) {
    return ''
  }

  return API_BASE_URL.endsWith('/topics') ? API_BASE_URL : `${API_BASE_URL}/topics`
}

async function fetchRemoteTopics() {
  const endpoint = getTopicsEndpoint()
  if (!endpoint) {
    return []
  }

  const response = await fetch(endpoint, {
    method: 'GET'
  })

  if (!response.ok) {
    throw new Error(`Failed to load topics (${response.status})`)
  }

  const payload = await response.json()
  return Array.isArray(payload) ? payload.filter(isValidTopic) : []
}

async function hydrateTopics() {
  if (initialized) {
    return
  }

  if (typeof window === 'undefined' || !API_BASE_URL) {
    topicsState.value = []
    loadErrorState.value = API_BASE_URL ? '' : 'VITE_API_BASE_URL is not configured'
    initialized = true
    return
  }

  isLoadingState.value = true
  loadErrorState.value = ''

  try {
    const remoteTopics = await fetchRemoteTopics()
    topicsState.value = remoteTopics.map((topic, index) => normalizeTopic(topic, index + 1))
  } catch (error) {
    loadErrorState.value = error instanceof Error ? error.message : 'Failed to load topics'
    topicsState.value = []
  } finally {
    isLoadingState.value = false
    initialized = true
  }
}

function ensureLoaded() {
  if (!initPromise) {
    initPromise = hydrateTopics()
  }

  return initPromise
}

async function createRemoteTopic(payload) {
  const endpoint = getTopicsEndpoint()
  if (!endpoint) {
    throw new Error('VITE_API_BASE_URL is not configured')
  }

  let response

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
  } catch {
    throw new Error('Network/CORS error while calling topics API. Check API Gateway CORS origins and methods.')
  }

  if (!response.ok) {
    let errorMessage = `Failed to create topic (${response.status})`

    try {
      const errorPayload = await response.json()
      if (errorPayload?.message) {
        errorMessage = errorPayload.message
      }
    } catch {
      // Keep the fallback error message when response isn't JSON.
    }

    throw new Error(errorMessage)
  }

  return response.json()
}

async function deleteRemoteTopic(topicId) {
  const endpoint = getTopicsEndpoint()
  if (!endpoint) {
    throw new Error('VITE_API_BASE_URL is not configured')
  }

  let response

  try {
    response = await fetch(`${endpoint}/${encodeURIComponent(topicId)}`, {
      method: 'DELETE'
    })
  } catch {
    throw new Error('Network/CORS error while deleting topic. Check API Gateway CORS origins and methods.')
  }

  if (!response.ok) {
    let errorMessage = `Failed to delete topic (${response.status})`

    try {
      const errorPayload = await response.json()
      if (errorPayload?.message) {
        errorMessage = errorPayload.message
      }
    } catch {
      // Keep the fallback error message when response isn't JSON.
    }

    throw new Error(errorMessage)
  }
}

export function useTopics() {
  if (!initialized) {
    ensureLoaded()
  }

  const topics = computed(() => topicsState.value)

  async function addTopic(payload) {
    await ensureLoaded()

    const title = payload.title.trim()
    const category = payload.category.trim()
    const outcome = payload.outcome.trim()
    const highlights = payload.highlights
      .map((item) => item.trim())
      .filter(Boolean)

    const nextDay = getNextDay(topicsState.value)
    const requestBody = {
      title,
      category,
      highlights,
      outcome,
      day: nextDay
    }

    const createdTopic = await createRemoteTopic(requestBody)
    const topicToStore = normalizeTopic(createdTopic, nextDay)

    if (!topicsState.value.some((topic) => topic.id === topicToStore.id)) {
      topicsState.value = [...topicsState.value, topicToStore]
    }

    return topicToStore
  }

  async function reloadTopics() {
    initialized = false
    initPromise = null
    await ensureLoaded()
  }

  async function deleteTopic(topicId) {
    await ensureLoaded()
    await deleteRemoteTopic(topicId)
    topicsState.value = topicsState.value.filter((topic) => topic.id !== topicId)
  }

  return {
    topics,
    isLoadingTopics: computed(() => isLoadingState.value),
    topicsLoadError: computed(() => loadErrorState.value),
    ensureLoaded,
    reloadTopics,
    addTopic,
    deleteTopic
  }
}

export function getTopicsApiBaseUrl() {
  return API_BASE_URL
}
