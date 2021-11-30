module.exports = {
  // Rendering setting
  //ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Capstone Client',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/notifications-ssr', ssr: true },
    { src: '~/plugins/notifications-client', ssr: false },
    { src: '~/plugins/vueLoadingOverlay' },
    { src: '~/plugins/vueIodash' },
    { src: "~plugins/vue-js-modal.js" }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  // Public environment variables
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    serverUrl: process.env.SERVER_URL || "http://localhost:3030"
  },

  // Private environment variables
  privateRuntimeConfig: {

  }
}
