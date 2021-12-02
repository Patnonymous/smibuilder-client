<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1>SmiBuilder Index</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: "Index",
  },
  components: {},
  data: function () {
    return {};
  },
  mounted: function () {
    this.$router.push({ path: "/builds/search" });
  },
  computed: {},
  methods: {},
};
</script>
