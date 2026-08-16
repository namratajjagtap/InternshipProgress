<script setup>
// Root layout coordinates navbar, sidebar visibility, and page title.
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import TopNavbar from './components/TopNavbar.vue'
import SidebarPanel from './components/SidebarPanel.vue'
import { topics } from './data/content'

const route = useRoute()
const isSidebarOpen = ref(true)

const pageTitle = computed(() => {
  const routeTitleMap = {
    '/': 'Home',
    '/about': 'About Me',
    '/trainings': 'Trainings'
  }

  if (route.path.startsWith('/topic/')) {
    return 'Topic Details'
  }

  return routeTitleMap[route.path] || 'Internship Portfolio'
})

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <!-- Shell structure provides shared navigation and persistent sidebar. -->
  <div class="app-shell" :class="{ 'app-shell--collapsed': !isSidebarOpen }">
    <TopNavbar
      :page-title="pageTitle"
      :is-sidebar-open="isSidebarOpen"
      @toggle-sidebar="toggleSidebar"
    />

    <div class="app-shell__content">
      <aside class="app-shell__sidebar" :class="{ 'app-shell__sidebar--hidden': !isSidebarOpen }">
        <SidebarPanel :topics="topics" />
      </aside>

      <main class="app-shell__main">
        <RouterView />
      </main>
    </div>
  </div>
</template>
