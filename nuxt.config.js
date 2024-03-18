// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      link: [
        { rel: "icon", hid: "icon", type: "image/png", href: `/favicon-32x32.png` },
        { rel: "apple-touch-icon", hid: "icon_1", sizes: "57x57", href: `/apple-icon-57x57.png` },
        { rel: "apple-touch-icon", hid: "icon_2", sizes: "60x60", href: `/apple-icon-60x60.png` },
        { rel: "apple-touch-icon", hid: "icon_3", sizes: "72x72", href: `/apple-icon-72x72.png` },
        { rel: "apple-touch-icon", hid: "icon_4", sizes: "76x76", href: `/apple-icon-76x76.png` },
        { rel: "apple-touch-icon", hid: "icon_5", sizes: "114x114", href: `/apple-icon-114x114.png` },
        { rel: "apple-touch-icon", hid: "icon_6", sizes: "120x120", href: `/apple-icon-120x120.png` },
        { rel: "apple-touch-icon", hid: "icon_7", sizes: "144x144", href: `/apple-icon-144x144.png` },
        { rel: "apple-touch-icon", hid: "icon_8", sizes: "152x152", href: `/apple-icon-152x152.png` },
        { rel: "apple-touch-icon", hid: "icon_9", sizes: "180x180", href: `/apple-icon-180x180.png` },
        { rel: "icon", type: "image/png", hid: "icon_11", sizes: "192x192", href: `/android-icon-192x192.png` },
        { rel: "icon", type: "image/png", hid: "icon_12", sizes: "32x32", href: `/favicon-32x32.png` },
        { rel: "icon", type: "image/png", hid: "icon_13", sizes: "96x96", href: `/favicon-96x96.png` },
        { rel: "icon", type: "image/png", hid: "icon_14", sizes: "16x16", href: `/favicon-16x16.png` },
        { name: "msapplication-TileColor", content: "#ffffff" },
        { name: "msapplication-TileImage", hid: "icon_15", content: `/ms-icon-144x144.png` },
        { name: "theme-color", content: "#ffffff" },
        // { rel: "manifest", hid: "manifest", href: `/manifest.json` }, // pwa module will generate manifest
      ],
    }
  },
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
