// Centralized app routes for all internship portfolio pages.
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import TrainingsView from '../views/TrainingsView.vue'
import TopicDetailView from '../views/TopicDetailView.vue'

const routes = [
  // Overview page with summary and one primary call-to-action.
  { path: '/', name: 'home', component: HomeView },
  // Personal introduction and background section.
  { path: '/about', name: 'about', component: AboutView },
  // Training sessions and key takeaways.
  { path: '/trainings', name: 'trainings', component: TrainingsView },
  // Detail page loaded from sidebar topic selection.
  { path: '/topic/:id', name: 'topic-detail', component: TopicDetailView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
