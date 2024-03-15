/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        'text': 'var(--text)',
        'text-light': 'var(--text-light)',
        'card': 'var(--card)',
        'primary': 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'secondary': 'var(--secondary)',
        'secondary-light': 'var(--secondary-light)',
        'line': 'var(--line)',
        'danger': 'var(--danger)',
      },
      boxShadow: {
        'container': 'var(--o-shadow)'
       }
    },
  },
  plugins: [],
  // darkMode: 'class'
}

