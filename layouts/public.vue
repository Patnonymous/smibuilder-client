<template>
  <div>
    <NavBar class="mb-4" />
    <Nuxt />
    <notifications position="bottom right" />
  </div>
</template>

<script>
import NavBar from "../components/NavigationHeader/NavBar.vue";
export default {
  middleware: ["relogin", "pathlog"],
  components: {
    NavBar,
  },
};
</script>
