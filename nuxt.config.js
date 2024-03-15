// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    // ...
    '@nuxtjs/tailwindcss',
  ],
  css: [
    `~/assets/css/variables.css`,
    `~/assets/css/main.css`,
  ],
  postcss: {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
  },
  tailwindcss: {
    cssPath: false,
  }
})
