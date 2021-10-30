<template>
  <div class="m-2">
    <div class="col p-1 bg-white rounded text-center">
      <div class="card" style="width: 5rem; height: 5rem">
        <img
          v-if="itemData !== null"
          v-b-tooltip.hover
          :title="abilityData.Summary"
          class="card-img-top"
          :src="abilityData.URL"
          alt="Ability Icon"
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
     * @description Determines which items will go in this frame. Can be: consumable, relic, item, all
     */
    frameType: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {};
  },
  mounted: async function () {
    const TAG = "\nItemFrameSmall - mounted(), ";
    console.log(TAG + "outputting itemData: ");
    console.log(this.itemData);
  },
  computed: {},
  methods: {},
};
</script>