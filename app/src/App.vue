<template>
  <v-app id="app">
    <r-header />
    <router-view />
  </v-app>
</template>

<script>
import RHeader from '@/components/RHeader';

export default {
  name: 'App',
  components: {
    RHeader,
  },
  message: 'Hello Vue!',
};
</script>

<style lang="scss">
@import '@/assets/css/main.scss';
</style>
