// Single source of structured content for topics and trainings.
export const internshipMeta = {
  title: 'Internship Learning Portfolio',
  internName: 'Namrata Jagtap',
  role: 'Apprentice',
  summary:
    'A practical journey through web fundamentals, team workflows, and feature delivery using Vue.js.'
}

// Topics are shown in the sidebar and used by /topic/:id route.
export const topics = [
  {
    id: 'html-basics',
    title: 'HTML Basics',
    category: 'Web Fundamentals',
    day: 2,
    highlights: [
      'Semantic tags and page structure',
      'Accessible forms with labels',
      'Reusable content blocks'
    ],
    outcome:
      'Built a semantic landing page with accessible sections and reusable markup.'
  },
  {
    id: 'css-layouts',
    title: 'CSS Layouts',
    category: 'Styling',
    day: 6,
    highlights: ['Flexbox patterns', 'Responsive breakpoints', 'Spacing systems'],
    outcome:
      'Converted static mockups into responsive layouts across desktop and mobile.'
  },
  {
    id: 'git-training',
    title: 'Git Training',
    category: 'Workflow',
    day: 11,
    highlights: ['Branch strategy', 'Meaningful commit messages', 'Pull request reviews'],
    outcome:
      'Collaborated safely with team workflows and reduced merge conflicts.'
  },
  {
    id: 'vue-components',
    title: 'Vue Components',
    category: 'Vue.js',
    day: 18,
    highlights: ['Props and events', 'Composable layouts', 'State-driven rendering'],
    outcome:
      'Implemented reusable components for dashboard modules and cards.'
  },
  {
    id: 'router-navigation',
    title: 'Router Navigation',
    category: 'Vue.js',
    day: 24,
    highlights: ['Dynamic routes', 'Route params', 'Nested navigation experience'],
    outcome:
      'Added topic detail routing and smooth page-level navigation.'
  }
]

// Formal and informal training sessions during internship.
export const trainings = [
  {
    name: 'Frontend Bootcamp',
    date: '2026-06-10',
    keyPoints: ['Clean component patterns', 'UI consistency', 'Review checklist']
  },
  {
    name: 'Git and Collaboration Workshop',
    date: '2026-06-19',
    keyPoints: ['PR hygiene', 'Conflict resolution', 'Branch naming conventions']
  },
  {
    name: 'Vue Productivity Session',
    date: '2026-07-03',
    keyPoints: ['Route architecture', 'Data organization', 'Reusable UI blocks']
  }
]

