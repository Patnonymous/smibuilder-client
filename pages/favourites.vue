<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1>Favourites</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "favourites",
  middleware: "authenticated",
  components: {},
  data: function () {
    return {};
  },
  mounted: function () {},
  computed: {},
  methods: {},
};
</script>