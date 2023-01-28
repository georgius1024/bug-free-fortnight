// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      title: 'Wordy',
      link: [
        {
          rel: 'icon',
          href: 'favicon.png',
          type: 'image/png'
        }        
      ]
    },
  }
});
