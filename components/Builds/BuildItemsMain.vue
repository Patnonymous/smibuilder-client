<template>
  <div>
    <div class="col">
      <!-- This row will hold consumables and relics -->
      <div class="row justify-content-center">
        <!-- Consumables -->
        <div class="col mr-2 bg-info rounded">
          <h2 class="m-0 text-center">Consumables</h2>
          <div class="row justify-content-center">
            <ItemFrameMedium
              v-for="(consumable, index) in consumablesObject"
              :key="index"
              :itemData="consumable"
              frameType="consumable"
            />
          </div>
        </div>
        <!-- Relics -->
        <div class="col mr-2 bg-info rounded">
          <h2 class="m-0 text-center">Relics</h2>
          <div class="row justify-content-center">
            <ItemFrameMedium
              v-for="(relic, index) in relicsObject"
              :key="index"
              :itemData="relic"
              frameType="relic"
            />
          </div>
        </div>
      </div>

      <!-- This row will hold the main items -->
      <div class="row justify-content-center">
        <div class="col mr-2 mt-2 bg-info rounded">
          <h2 class="m-0 text-center">Items</h2>
          <div class="row justify-content-center">
            <ItemFrameMedium
              v-for="(item, index) in mainItemsObject"
              :key="index"
              :itemData="item"
              frameType="item"
            />
          </div>
        </div>
      </div>

      <!-- This row will hold the extra items, which can be anything (consumables, relics, etc.) -->
      <div class="row justify-content-center">
        <div class="col mr-2 mt-2 bg-info rounded">
          <h2 class="m-0 text-center">Extra Items</h2>
          <div class="row justify-content-center">
            <ItemFrameMedium
              v-for="(extra, index) in extrasObject"
              :key="index"
              :itemData="extra"
              frameType="any"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports
import ItemFrameMedium from "../Items/ItemFrameMedium.vue";

/**
 * @description Displays a builds items. Display only.
 * You cannot change the items with the components.
 */
export default {
  name: "BuilderItemsMain",
  components: {
    ItemFrameMedium,
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
    godName: {
      type: String,
      required: true,
    },
    consumablesObject: {
      type: Object,
      required: true,
    },
    relicsObject: {
      type: Object,
      required: true,
    },
    mainItemsObject: {
      type: Object,
      required: true,
    },
    extrasObject: {
      type: Object,
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
