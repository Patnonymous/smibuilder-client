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
              @click.native="
                showItemSelectorModal('consumable', index, 'consumablesObject')
              "
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
              @click.native="
                showItemSelectorModal('relic', index, 'relicsObject')
              "
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
              @click.native="
                showItemSelectorModal('item', index, 'mainItemsObject')
              "
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
              @click.native="
                showItemSelectorModal('any', index, 'extrasObject')
              "
            />
          </div>
        </div>
      </div>
    </div>
    <ItemSelectorModal
      name="item-selector-modal"
      :godRole="godRole"
      :godDamageType="godDamageType"
      :godBasicAttackType="godBasicAttackType"
      :forcedFilter="filterType"
      :godName="godName"
      :currentlyEquippedItemIds="formatEquippedItems"
      @itemSelected="frameThisItem"
    />
  </div>
</template>

<script>
// Imports
import ItemFrameMedium from "../Items/ItemFrameMedium.vue";
import ItemSelectorModal from "../Modals/ItemSelectorModal.vue";

/**
 * @description This is the section of the builder that shows what items are in the build.
 * Contains props for role, damage type, and basic attack type. These props will help determine what
 * items can be used in the build. Ex. A Physical damage type god cannot use Magical damage type items.
 */
export default {
  name: "BuilderItemsMain",
  components: {
    ItemFrameMedium,
    ItemSelectorModal,
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
  },
  data: function () {
    return {
      /** Consumable Items */
      consumablesObject: { consumable1: null, consumable2: null },
      /** Relic Items */
      relicsObject: { relic1: null, relic2: null },
      /** Item Items. */
      mainItemsObject: {
        item1: null,
        item2: null,
        item3: null,
        item4: null,
        item5: null,
        item6: null,
      },
      /** Extra Items */
      extrasObject: {
        extra1: null,
        extra2: null,
        extra3: null,
        extra4: null,
        extra5: null,
        extra6: null,
      },
      /** Filter type tells what the Item Selector Modal to filter to. */
      filterType: "",
      frameIndex: null,
      frameHelper: "",
    };
  },
  mounted: async function () {},
  computed: {
    formatEquippedItems: function () {
      let equippedItems = [];
      if (this.filterType === "consumable") {
        for (const item in this.consumablesObject) {
          if (this.consumablesObject[item] !== null) {
            equippedItems.push(this.consumablesObject[item].ItemId);
          }
        }
      } else if (this.filterType === "relic") {
        for (const item in this.relicsObject) {
          if (this.relicsObject[item] !== null) {
            equippedItems.push(this.relicsObject[item].ItemId);
          }
        }
      } else if (this.filterType === "item") {
        for (const item in this.mainItemsObject) {
          if (this.mainItemsObject[item] !== null) {
            equippedItems.push(this.mainItemsObject[item].ItemId);
          }
        }
      } else if (this.filterType === "any") {
        for (const item in this.extrasObject) {
          if (this.extrasObject[item] !== null) {
            equippedItems.push(this.extrasObject[item].ItemId);
          }
        }
      }
      return equippedItems;
    },
    getWindowWidth: function () {
      return window.innerWidth - 200;
    },
    getWindowHeight: function () {
      return window.innerHeight - 50;
    },
  },
  methods: {
    /**
     * @param {String} filterType Type of filter to force when getting items.
     * @param {String} index Object index in the item holder objects. Ex. 'relic1'
     * @param {String} frameTypeHelper The object name of the item holder. Ex. 'mainItemsObject'
     *
     * @description Set the filterType, frameIndex, and frameHelper then shows the ItemSelectorModal.
     */
    showItemSelectorModal: function (filterType, index, frameTypeHelper) {
      this.filterType = filterType;
      this.frameIndex = index;
      this.frameHelper = frameTypeHelper;
      this.$modal.show("item-selector-modal");
    },
    /**
     * @param {JSON} value The items data.
     *
     * @description Uses frameHelper and frameIdex to save the item data to the
     * appropriate frame.
     */
    frameThisItem: function (value) {
      this.$modal.hide("item-selector-modal");
      this[this.frameHelper][this.frameIndex] = value;
    },
    clearAllItemFrames: function () {
      for (const item in this.consumablesObject) {
        this.consumablesObject[item] = null;
      }
      for (const item in this.relicsObject) {
        this.relicsObject[item] = null;
      }
      for (const item in this.mainItemsObject) {
        this.mainItemsObject[item] = null;
      }
      for (const item in this.extrasObject) {
        this.extrasObject[item] = null;
      }
    },
    returnEquippedItemIds: function () {
      let consumables = {};
      let relics = {};
      let mainItems = {};
      let extraItems = {};

      for (const item in this.consumablesObject) {
        if (this.consumablesObject[item] !== null) {
          consumables[item] = this.consumablesObject[item].ItemId;
        } else {
          consumables[item] = null;
        }
      }
      for (const item in this.relicsObject) {
        if (this.relicsObject[item] !== null) {
          relics[item] = this.relicsObject[item].ItemId;
        } else {
          relics[item] = null;
        }
      }
      for (const item in this.mainItemsObject) {
        if (this.mainItemsObject[item] !== null) {
          mainItems[item] = this.mainItemsObject[item].ItemId;
        } else {
          mainItems[item] = null;
        }
      }
      for (const item in this.extrasObject) {
        if (this.extrasObject[item] !== null) {
          extraItems[item] = this.extrasObject[item].ItemId;
        } else {
          extraItems[item] = null;
        }
      }

      let allItemsObject = { consumables, relics, mainItems, extraItems };
      return allItemsObject;
    },
  },
};
</script>
