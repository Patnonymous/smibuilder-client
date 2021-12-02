<template>
  <div class="m-2 item-frame-style">
    <div class="col-auto p-1 bg-white rounded">
      <div class="card item-frame-medium">
        <img
          v-if="itemData !== null"
          class="card-img-top"
          :src="itemData.itemIcon_URL"
          alt="Item Icon"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemFrameSmall",
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
    /**
     * @description Determines which items will go in this frame. Can be: consumable, relic, item, any
     */
    frameType: {
      type: String,
      required: true,
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
.item-frame-style {
  cursor: pointer;
  transition: transform 0.2s;
}
.item-frame-style:hover {
  transform: scale(1.2);
}

.item-frame-medium {
  width: 5rem;
  height: 5rem;
}
</style>