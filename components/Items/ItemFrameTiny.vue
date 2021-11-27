<template>
  <div class="m-0 p-0 item-frame-style">
    <div class="col-auto p-1 bg-dark rounded">
      <div class="card item-frame-small">
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
/**
 * @author Patrick W.
 * @description The smallest most basic ItemFrame. Simply displays the items icon.
 * No fancy animations or functionality here.
 */
export default {
  name: "ItemFrameTiny",
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
.item-frame-small {
  width: 3rem;
  height: 3rem;
}
</style>