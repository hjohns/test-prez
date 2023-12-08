// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    baseURL: '/test-prez/',
    buildAssetsDir: 'nuxt/',
  },
  plugins: [
    'plugins/vuetify'
  ],
  hooks: {
    'pages:extend'(pages) {
      const pagesToDuplicate = pages.filter(page => page.path.startsWith('/catalogs'));
      pagesToDuplicate.forEach(page => {
        pages.push({
          ...page,
          path: `/v${page.path}`,
          name: `v-${page.name}`,
        });
        pages.push({
          ...page,
          path: `/c${page.path}`,
          name: `c-${page.name}`,
        });
        pages.push({
          ...page,
          path: `/s${page.path}`,
          name: `s-${page.name}`,
        });
      });  
    }
  },    
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      DATASET_LIST_URL: process.env.DATASET_LIST_URL,
      DATASET_OBJECT_URL: process.env.DATASET_OBJECT_URL            
    },
  },
  devtools: {
    enabled: true
  },
  modules: [
    '@pinia/nuxt'
  ],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ]
  },
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css'],
  build: {
    transpile: ['vuetify'],

  },
  nitro: {
    prerender: {
      failOnError: false
    }
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})
