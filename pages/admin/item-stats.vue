<template>
  <div class="container">
    <h1>Admin - Item stats</h1>
  </div>
</template>

<script>
export default {
  name: "item-stats",
  layout: "default",
  components: {},
  data: function () {
    return {};
  },
  mounted: function () {
    // Set store page name.
    this.$store.commit("navigation/changePage", "Admin");
  },
  computed: {},
  methods: {},
};
</script>
