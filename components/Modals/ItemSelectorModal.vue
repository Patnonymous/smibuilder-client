<template>
  <modal
    :name="name"
    @before-open="clearData"
    @opened="modalOpened"
    :resizable="true"
    :adaptive="true"
    :width="getWindowWidth"
    :height="getWindowHeight"
  >
    <loading :active.sync="isLoading" :is-full-page="fullPage" />
    <div class="mt-2 mb-2 ml-4 mr-4 mh-100 overflow-auto p-4">
      <!-- This row will hold the filter and main item search  -->
      <div class="row">
        <!-- This col will hold the filter -->
        <div class="col-3 p-4 border border-primary">
          <!-- Filters Header -->
          <div class="row justify-content-center">
            <div class="col-auto text-center">
              <h2>Filters</h2>
            </div>
          </div>
          <!-- General filters -->
          <FilterPanel
            filterGroup="general"
            groupTitle="General"
            ref="generalFilterPanel"
            :arrayOfFilterStrings="arrayGeneralFilterStrings"
            @filter-change="filterChanged"
          />
          <!-- Offense filters -->
          <FilterPanel
            filterGroup="offense"
            groupTitle="Offense"
            ref="offenseFilterPanel"
            :arrayOfFilterStrings="arrayOffenseFilterStrings"
            @filter-change="filterChanged"
          />
          <!-- Defense  filters -->
          <FilterPanel
            filterGroup="defense"
            groupTitle="Defense"
            ref="defenseFilterPanel"
            :arrayOfFilterStrings="arrayDefenseFilterStrings"
            @filter-change="filterChanged"
          />
          <!-- Utility filters -->
          <FilterPanel
            filterGroup="utility"
            groupTitle="Utility"
            ref="utilityFilterPanel"
            :arrayOfFilterStrings="arrayUtilityFilterStrings"
            @filter-change="filterChanged"
          />

          <div class="row justify-content-center">
            <div class="col-auto">
              <button
                class="btn btn-dark"
                type="button"
                @click="resetAllFilters"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>

        <!-- This col will hold the item search -->
        <div class="col border border-primary">
          <div class="row p-2">
            <div class="col">
              <input
                v-model="userSearchTerm"
                type="text"
                class="form-control"
                placeholder="Search by name..."
              />
            </div>
          </div>

          <div class="row item-list-height">
            <div class="col mh-100 overflow-auto">
              <!-- Each row is a chunk of arrayChunk. -->
              <div
                class="row mt-1 border border-warning"
                v-for="(chunk, index) in filteredItemsArray"
                :key="index"
              >
                <!-- Each col is an item in the chunk. -->
                <div
                  class="col-auto m-auto"
                  v-for="item in chunk"
                  :key="item.id"
                >
                  <ItemFrameSmall
                    @click.native="itemClicked(item)"
                    :itemData="item"
                    :frameType="forcedFilter"
                  />
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
              <ItemTree
                v-if="selectedItem !== null && selectedItem.Type === 'Item'"
                :rootItemId="selectedItem.RootItemId"
                :selectedItemId="selectedItem.ItemId"
              />
            </div>
            <div class="col-5 border border-warning">
              <ItemFrameDetailed :itemData="selectedItem" />
              <div class="row" v-if="selectedItem !== null">
                <div class="col">
                  <button
                    @click="clearCurrentItemSelection"
                    type="button"
                    class="btn btn-outline-warning float-left"
                  >
                    Clear Selection
                  </button>
                </div>
                <div class="col">
                  <button
                    @click="selectCurrentItem"
                    type="button"
                    class="btn btn-outline-primary float-right"
                  >
                    Select This Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
// Imports
import ItemFrameSmall from "../Items/ItemFrameSmall.vue";
import FilterPanel from "../Gods/FilterPanel.vue";
import ItemFrameDetailed from "../Items/ItemFrameDetailed.vue";
import ItemTree from "../Items/ItemTree.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "ItemSelectorModal",
  components: {
    ItemFrameSmall,
    FilterPanel,
    ItemFrameDetailed,
    ItemTree,
    Loading,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
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
    godName: {
      type: String,
      required: false,
      default: "Not Ratatoskr",
    },
    currentlyEquippedItemIds: {
      type: Array,
      required: true,
    },
  },
  data: function () {
    return {
      // This is the array of items, retrieved on beforeMount.
      itemsArray: [],
      arrayGeneralFilterStrings: ["Consumable", "Relic", "Starter Item"],
      arrayOffenseFilterStrings: [
        "Power",
        "Attack Speed",
        "Lifesteal",
        "Penetration",
        "Crit Chance",
        "Crit Damage",
      ],
      arrayDefenseFilterStrings: [
        "Phys DEF",
        "Mag DEF",
        "Health",
        "HP5",
        "CCR",
      ],
      arrayUtilityFilterStrings: [
        "Has Aura",
        "Move Speed",
        "Cooldown",
        "Mana",
        "MP5",
      ],
      currentlySelectedFilters: {
        general: [],
        offense: [],
        defense: [],
        utility: [],
      },
      userSearchTerm: "",
      selectedItem: null,
      // Vue loading overlay control bool.
      isLoading: false,
      // Vue loading overlay full page.
      fullPage: true,
    };
  },
  mounted: async function () {},
  computed: {
    /**
     * @description Filters items according to the current user filters.
     * Returns a chunked, filtered array.
     */
    filteredItemsArray: function () {
      const SELF = this;
      function showThisItem(item) {
        const { Menuitems } = item.ItemDescription;

        // GENERAL filters
        if (SELF.currentlySelectedFilters.general.length > 0) {
          if (
            SELF.currentlySelectedFilters.general.includes("Consumable") &&
            item.Type !== "Consumable"
          ) {
            return false;
          }
          if (
            SELF.currentlySelectedFilters.general.includes("Relic") &&
            item.Type !== "Active"
          ) {
            return false;
          }
          if (
            SELF.currentlySelectedFilters.general.includes("Starter Item") &&
            item.StartingItem !== true
          ) {
            return false;
          }
        }

        // OFFENSE filters
        if (SELF.currentlySelectedFilters.offense.length > 0) {
          if (SELF.currentlySelectedFilters.offense.includes("Power")) {
            // Start out with false.
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (
                Menuitems[index].Description === "Physical Power" ||
                Menuitems[index].Description === "Magical Power"
              ) {
                // If the item meets the criteria, set to true and break.
                thisItemIsGood = true;
                break;
              }
              index++;
            }
            // Finally, if the item did not meet criteria, return false;
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (SELF.currentlySelectedFilters.offense.includes("Attack Speed")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (Menuitems[index].Description === "Attack Speed") {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (SELF.currentlySelectedFilters.offense.includes("Lifesteal")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (
                Menuitems[index].Description === "Physical Lifesteal" ||
                Menuitems[index].Description === "Magical Lifesteal"
              ) {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (SELF.currentlySelectedFilters.offense.includes("Penetration")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (
                Menuitems[index].Description === "Physical Penetration" ||
                Menuitems[index].Description === "Magical Penetration"
              ) {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (SELF.currentlySelectedFilters.offense.includes("Crit Chance")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (Menuitems[index].Description === "Critical Strike Chance") {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (
            SELF.currentlySelectedFilters.offense.includes("Crit Damage") &&
            item.ItemId !== 7545
          ) {
            return false;
          }
        }

        // DEFENSE filters
        if (SELF.currentlySelectedFilters.defense.length > 0) {
          if (SELF.currentlySelectedFilters.defense.includes("Phys DEF")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (Menuitems[index].Description === "Physical Protection") {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (SELF.currentlySelectedFilters.defense.includes("Mag DEF")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (Menuitems[index].Description === "Magical Protection") {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (SELF.currentlySelectedFilters.defense.includes("Health")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (Menuitems[index].Description === "Health") {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (SELF.currentlySelectedFilters.defense.includes("HP5")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (Menuitems[index].Description === "HP5") {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (SELF.currentlySelectedFilters.defense.includes("CCR")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (Menuitems[index].Description === "Crowd Control Reduction") {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }
        }

        // UTILITY filters
        if (SELF.currentlySelectedFilters.utility.length > 0) {
          if (
            SELF.currentlySelectedFilters.utility.includes("Has Aura") &&
            item.ItemDescription.SecondaryDescription === null
          ) {
            return false;
          } else if (
            SELF.currentlySelectedFilters.utility.includes("Has Aura") &&
            !item.ItemDescription.SecondaryDescription.toLowerCase().includes(
              "aura"
            )
          ) {
            return false;
          }

          if (SELF.currentlySelectedFilters.utility.includes("Move Speed")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (Menuitems[index].Description === "Movement Speed") {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (SELF.currentlySelectedFilters.utility.includes("Cooldown")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (Menuitems[index].Description === "Cooldown Reduction") {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (SELF.currentlySelectedFilters.utility.includes("Mana")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (Menuitems[index].Description === "Mana") {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }

          if (SELF.currentlySelectedFilters.utility.includes("MP5")) {
            let thisItemIsGood = false;
            let index = 0;
            let aLength = Menuitems.length;
            while (index < aLength) {
              if (Menuitems[index].Description === "MP5") {
                thisItemIsGood = true;
              }
              index++;
            }
            if (!thisItemIsGood) {
              return false;
            }
          }
        }

        // Passed filter settings, now check against the search bar.
        if (SELF.userSearchTerm.length !== 0) {
          let regex = new RegExp(SELF.userSearchTerm, "gi");
          if (!regex.test(item.DeviceName)) {
            return false;
          }
        }

        return true;
      }
      return this.lodash.chunk(this.itemsArray.filter(showThisItem), 8);
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
     * @description User clicks on an item.
     */
    itemClicked: function (itemData) {
      this.selectedItem = itemData;
    },
    clearCurrentItemSelection: function () {
      this.selectedItem = null;
    },
    selectCurrentItem: function () {
      this.$emit("itemSelected", this.selectedItem);
    },
    /**
     * Gets called when a filter changed. Sets the currently selected filters
     * to the newest updated list of filters.
     */
    filterChanged: function (selectedFilters) {
      this.currentlySelectedFilters[selectedFilters.filterGroup] =
        selectedFilters.selectedFilters;
    },
    /**
     * @description Reset all the items filters to unchecked state.
     */
    resetAllFilters: function () {
      this.$refs.generalFilterPanel.uncheckAllFilters();
      this.$refs.offenseFilterPanel.uncheckAllFilters();
      this.$refs.defenseFilterPanel.uncheckAllFilters();
      this.$refs.utilityFilterPanel.uncheckAllFilters();
    },
    /**
     * @description Clear and reset data.
     */
    clearData: function (event) {
      this.itemsArray.length = 0;
      this.selectedItem = null;
      this.userSearchTerm = "";
      this.currentlySelectedFilters.general.length = 0;
      this.currentlySelectedFilters.offense.length = 0;
      this.currentlySelectedFilters.defense.length = 0;
      this.currentlySelectedFilters.utility.length = 0;
    },
    modalOpened: async function (event) {
      // Show loading and init vars.
      this.isLoading = true;
      let isRat = false;
      let itemsResponse = [];

      // Do all the gets... (they're actually posts)
      if (this.forcedFilter === "consumable") {
        itemsResponse = await this.$axios.$post(
          `${this.$config.serverUrl}/items/consumables`,
          { equipped: this.currentlyEquippedItemIds }
        );
      } else if (this.forcedFilter === "relic") {
        itemsResponse = await this.$axios.$post(
          `${this.$config.serverUrl}/items/relics`,
          { equipped: this.currentlyEquippedItemIds }
        );
      } else if (this.forcedFilter === "item") {
        if (this.godName === "Ratatoskr") {
          isRat = true;
        }
        itemsResponse = await this.$axios.$post(
          `${this.$config.serverUrl}/items/${this.godRole}/${
            this.godDamageType
          }/${this.godBasicAttackType}/${true}/${isRat}`,
          { equipped: this.currentlyEquippedItemIds }
        );
      } else if (this.forcedFilter === "any") {
        itemsResponse = await this.$axios.$post(
          `${this.$config.serverUrl}/items`,
          { equipped: this.currentlyEquippedItemIds }
        );
      }
      if (itemsResponse.status === "Failure") {
        this.$notify({
          title: "Items Error",
          text: `An error has occurred: ${allItemsResponse.resData}`,
          duration: 6000,
          type: "error",
        });
        this.isLoading = false;
      } else if (itemsResponse.status === "Success") {
        this.itemsArray = itemsResponse.resData;
        this.isLoading = false;
      }
    },
  },
};
</script>


<style scoped>
.item-list-height {
  height: 50vh;
}
</style>