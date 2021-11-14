<template>
  <div class="row align-items-center justify-content-center">
    <!-- Tier 1s -->
    <div class="col">
      <ItemTreeFrame
        v-for="tier1Item in itemTreeData.tier1Items"
        :key="tier1Item.ItemId"
        :itemData="tier1Item"
        :class="{ 'bg-success': selectedItemId === tier1Item.ItemId }"
        class="rounded"
      />
    </div>
    <!-- Tier 2s -->
    <div class="col">
      <ItemTreeFrame
        v-for="tier2Item in itemTreeData.tier2Items"
        :key="tier2Item.ItemId"
        :itemData="tier2Item"
        :class="{ 'bg-success': selectedItemId === tier2Item.ItemId }"
        class="rounded"
      />
    </div>
    <!-- Tier 3s -->
    <div class="col">
      <ItemTreeFrame
        v-for="tier3Item in itemTreeData.tier3Items"
        :key="tier3Item.ItemId"
        :itemData="tier3Item"
        :class="{ 'bg-success': selectedItemId === tier3Item.ItemId }"
        class="rounded"
      />
    </div>
  </div>
</template>

<script>
// Import
import ItemTreeFrame from "./ItemTreeFrame.vue";

export default {
  name: "ItemTree",
  components: {
    ItemTreeFrame,
  },
  props: {
    rootItemId: {
      type: Number,
      required: true,
    },
    selectedItemId: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      itemTreeData: { tier1Items: [], tier2Items: [], tier3Items: [] },
    };
  },
  beforeMount: async function () {
    let treeResponse = await this.$axios.$get(
      `${this.$config.serverUrl}/items/tree/${this.rootItemId}`
    );

    if (treeResponse.status === "Failure") {
      this.$notify({
        title: "Item Tree Error",
        text: `An error has occurred: ${treeResponse.resData}`,
        duration: 6000,
        type: "error",
      });
    } else if (treeResponse.status === "Success") {
      treeResponse.resData.tier1Items.forEach((item) => {
        this.itemTreeData.tier1Items.push(item);
      });
      treeResponse.resData.tier2Items.forEach((item) => {
        this.itemTreeData.tier2Items.push(item);
      });
      treeResponse.resData.tier3Items.forEach((item) => {
        this.itemTreeData.tier3Items.push(item);
      });
    }
  },
  mounted: async function () {},
  watch: {
    rootItemId: async function (newItemId, oldItemId) {
      if (newItemId !== oldItemId) {
        this.resetData();
        let treeResponse = await this.$axios.$get(
          `${this.$config.serverUrl}/items/tree/${newItemId}`
        );

        if (treeResponse.status === "Failure") {
          this.$notify({
            title: "Item Tree Error",
            text: `An error has occurred: ${treeResponse.resData}`,
            duration: 6000,
            type: "error",
          });
        } else if (treeResponse.status === "Success") {
          treeResponse.resData.tier1Items.forEach((item) => {
            this.itemTreeData.tier1Items.push(item);
          });
          treeResponse.resData.tier2Items.forEach((item) => {
            this.itemTreeData.tier2Items.push(item);
          });
          treeResponse.resData.tier3Items.forEach((item) => {
            this.itemTreeData.tier3Items.push(item);
          });
        }
      }
    },
  },
  computed: {},
  methods: {
    resetData: function () {
      this.itemTreeData.tier1Items.length = 0;
      this.itemTreeData.tier2Items.length = 0;
      this.itemTreeData.tier3Items.length = 0;
    },
  },
};
</script>

<style>
</style>