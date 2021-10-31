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
              @click.native="showItemSelectorModal('consumable')"
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
              @click.native="showItemSelectorModal('relic')"
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
              @click.native="showItemSelectorModal('item')"
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
  },
  data: function () {
    return {
      consumablesObject: { consumable1: null, consumable2: null },
      relicsObject: { relic1: null, relic2: null },
      mainItemsObject: {
        item1: null,
        item2: null,
        item3: null,
        item4: null,
        item5: null,
        item6: null,
      },
      extrasObject: {
        extra1: null,
        extra2: null,
        extra3: null,
        extra4: null,
        extra5: null,
        extra6: null,
      },
    };
  },
  mounted: async function () {},
  computed: {
    getWindowWidth: function () {
      return window.innerWidth - 200;
    },
    getWindowHeight: function () {
      return window.innerHeight - 200;
    },
  },
  methods: {
    /**
     * @description Use Vue Modals dynamic modal implementation. Displays a modal that uses the ItemSelectorModal as a template.
     */
    showItemSelectorModal: function (filterType) {
      this.$modal.show(
        ItemSelectorModal,
        {
          godRole: this.godRole,
          godDamageType: this.godDamageType,
          godBasicAttackType: this.godBasicAttackType,
          forcedFilter: filterType,
        },
        {
          name: "itemSelectorModal",
          resizable: true,
          adaptive: true,
          width: this.getWindowWidth,
          height: "auto",
          scrollable: true,
        }
      );
    },
  },
};
</script>
