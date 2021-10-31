<template>
  <div class="mt-2 mb-2 ml-4 mr-4">
    <!-- This row will hold the filter and main item search  -->
    <div class="row">
      <!-- This col will hold the filter -->
      <div class="col-3">
        <div class="row">
          <div class="col"><h3>General</h3></div>
        </div>
      </div>

      <!-- This col will hold the item search -->
      <div class="col border border-primary">
        <div class="row">
          <div class="col">
            <h2>Search Bar Here</h2>
          </div>
        </div>

        <div class="row item-list-height">
          <div class="col mh-100 overflow-auto">
            <!-- Each row is a chunk of arrayChunk. -->
            <div
              class="row justify-content-between mt-1 border border-warning"
              v-for="(chunk, index) in chunkedItems"
              :key="index"
            >
              <!-- Each of these col's is a item in chunk, in this case it's the characters. -->
              <div class="col-auto" v-for="item in chunk" :key="item.id">
                <ItemFrameSmall :itemData="item" :frameType="forcedFilter" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- This row will hold the item tree view and select button -->
    <div class="row mt-3 border border-secondary">
      <!-- Item tree col -->
      <div class="col border border-primary">
        <div class="row">
          <div class="col">
            <h2>Item tree in here</h2>
          </div>
          <div class="col-4 border border-warning">
            <h4>Selected item here</h4>
          </div>
        </div>
      </div>

      <!-- Select button col -->
      <div class="col-2">
        <div class="row justify-content-center">
          <div class="col">
            <button
              type="button"
              class="btn btn-outline-primary mt-2 mb-2 w-100"
            >
              Select Item
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports
import ItemFrameSmall from "../Items/ItemFrameSmall.vue";

export default {
  name: "ItemSelectorModal",
  components: {
    ItemFrameSmall,
  },
  props: {
    godRole: {
      type: String,
      required: true,
    },
    godDamageType: {
      type: String,
      required: true,
    },
    godBasicAttackType: {
      type: String,
      required: true,
    },
    forcedFilter: {
      type: String,
      required: false,
      default: "any",
    },
  },
  data: function () {
    return {
      itemsArray: [],
    };
  },
  beforeMount: async function () {
    const TAG = "\nItemSelectorModal - beforeMout(), ";
    console.log(TAG + "getting items before mount.");
    console.log("forcedFilter: ", this.forcedFilter);

    let loader = this.$loading.show();
    let itemsResponse = [];

    if (this.forcedFilter === "consumable") {
      itemsResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/items/consumables`
      );
    } else if (this.forcedFilter === "relic") {
      itemsResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/items/relics`
      );
    } else if (this.forcedFilter === "item") {
      itemsResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/items/${this.godRole}/${
          this.godDamageType
        }/${this.godBasicAttackType}/${true}`
      );
    }

    console.log("itemsResponse: ", itemsResponse);

    if (itemsResponse.status === "Failure") {
      this.$notify({
        title: "Items Error",
        text: `An error has occurred: ${allItemsResponse.resData}`,
        duration: 6000,
        type: "error",
      });
      loader.hide();
    } else if (itemsResponse.status === "Success") {
      this.itemsArray = itemsResponse.resData;
      console.log("Item object 2: ");
      console.dir(this.itemsArray[1]);
      loader.hide();
    }
  },
  mounted: async function () {
    const TAG = "\nItemSelectorModal - mounted(), ";
    console.log(TAG + "mounted.");
  },
  computed: {
    chunkedItems: function () {
      return this.lodash.chunk(this.itemsArray, 8);
    },
  },
  methods: {},
};
</script>


<style scoped>
.item-list-height {
  height: 50vh;
}
</style>