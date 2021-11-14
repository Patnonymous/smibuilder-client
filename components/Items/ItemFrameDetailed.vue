<template>
  <div>
    <div v-if="itemData !== null">
      <!-- Item icon, name and shot desc. -->
      <div
        class="
          row
          justify-content-center
          align-items-center
          text-center
          bg-info
          rounded
        "
      >
        <div class="col-auto">
          <img :src="itemData.itemIcon_URL" alt="Item Icon" class="img" />
        </div>
        <div class="col p-0 m-0">
          <h5>{{ itemData.DeviceName }}</h5>
          <p>{{ itemData.ShortDesc }}</p>
        </div>
      </div>

      <!-- Effects -->
      <div
        class="
          row
          justify-content-center
          align-items-center
          text-center
          m-0
          p-0
          d-block
        "
      >
        <span
          class="d-block text-dark"
          v-for="(menuItem, index) in itemData.ItemDescription.Menuitems"
          :key="index"
        >
          {{ menuItem.Description }}: {{ menuItem.Value }}
        </span>
      </div>

      <!-- Passive effects -->
      <div
        class="
          row
          justify-content-center
          align-items-center
          text-center
          m-0
          p-0
          d-block
        "
      >
        <small
          class="d-block text-dark"
          v-for="(passive, index) in formatPassiveEffects"
          :key="index"
        >
          {{ passive }}
        </small>
      </div>
    </div>
    <div v-else class="card" style="width: 18rem">
      <h4>Current Selection: None.</h4>
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
  computed: {
    /**
     * @description Returns the passive effects as an array.
     * If there is no passive effect, return an empty array.
     */
    formatPassiveEffects: function () {
      if (this.itemData.ItemDescription.SecondaryDescription == null) {
        return [];
      } else {
        return this.itemData.ItemDescription.SecondaryDescription.split("\n\n");
      }
    },
  },
  methods: {},
};
</script>

<style scoped>
img {
  width: 4rem;
  height: 4rem;
}
</style>