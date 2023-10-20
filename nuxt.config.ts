// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth',
  ],
  css: [
    "primevue/resources/themes/mdc-light-indigo/theme.css"
  ],
  auth: {
    globalAppMiddleware: true,
  },
  build: {
    transpile: ["primevue"]
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8080/api"
    }
  },
})
