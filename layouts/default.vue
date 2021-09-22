<template>
  <div>
    <NavBar class="mb-4" />
    <Nuxt />
  </div>
</template>

<script>
import NavBar from "../components/NavigationHeader/NavBar.vue";
export default {
  components: {
    NavBar,
  },
};
</script>
