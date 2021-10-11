<template>
  <div class="container">
    <h1>Builds - search</h1>
  </div>
</template>

<script>
export default {
  name: "search",
  layout: "public",
  components: {},
  data: function () {
    return {};
  },
  mounted: function () {
    // DEBUG output user state
    const TAG = "search.vue - mounted(), ";
    console.log(TAG + "Outputting user state");
    console.log(this.$store.state.user);
  },
  computed: {},
  methods: {},
};
</script>
