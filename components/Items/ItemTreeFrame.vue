<template>
  <div class="row m-2 p-1 justify-content-center d-block text-center">
    <div class="col">
      <div class="row justify-content-center">
        <div class="col">
          <img :src="itemData.itemIcon_URL" alt="Item Icon" class="img" />
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col">
          <small class="text-dark">{{ itemData.DeviceName }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemTreeFrame",
  components: {},
  props: {
    /**
     * @description Object containing item data. This is not required and defaults to null.
     */
    itemData: {
      type: Object,
      required: true,
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

<style scoped>
img {
  width: 2rem;
  height: 2rem;
}
</style>