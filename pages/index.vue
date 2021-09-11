<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1>Capstone Client Index</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: function () {
    return {
      myNumber: 2,
    };
  },
  mounted: function () {},
  computed: {},
  methods: {
    goToOtherPageUsingButton: function () {
      const TAG = "index - goToOtherPageUsingButton(), ";
      console.log(TAG + "clicked and starting.");

      this.$router.push({ path: "other-page" });
    },
  },
};
</script>
