<template>
  <div>
    <div v-if="itemData !== null" class="card" style="width: 18rem">
      <img class="card-img-top" src="..." alt="Card image cap" />
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>

    <div v-else class="card" style="width: 18rem">
      <h3>Current Selection: None.</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemFrameDetailed",
  components: {},
  props: {
    /**
     * @description Object containing item data. This is not required and defaults to null.
     */
    itemData: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data: function () {
    return {};
  },
  mounted: async function () {},
  computed: {},
  methods: {},
};
</script>

<style>
</style>