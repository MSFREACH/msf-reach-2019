<template>
  <v-container grid-list-md>
    <v-layout>
      <v-flex>
        <h1>Under Construction</h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Placeholder',
  props: {
    name: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/css/lists.scss';

h1 {
  text-transform: uppercase;
  text-align: centered;
  font-size: 120px;
  color: #fff;
  opacity: 0.4;
  background: #d0d3da;
  border-radius: 10px;
  margin: 2em auto;
  position: relative;
  padding: 0.5em;
}
</style>
