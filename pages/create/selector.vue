<template>
  <div class="container-fluid border border-danger">
    <!-- Main outer row contains both columns. -->
    <div class="row ml-4 mr-4">
      <!-- First col is filter column -->
      <div class="col-3 p-4 border border-primary">
        <!-- Filters Header -->
        <div class="row justify-content-center">
          <div class="col-auto text-center">
            <h2>Filters</h2>
          </div>
        </div>
        <!-- Class filters -->
        <FilterPanel
          filterGroup="godClass"
          groupTitle="By Class"
          ref="classFilterPanel"
          :arrayOfFilterStrings="arrayClassFilterStrings"
          @filter-change="filterChanged"
        />
        <!-- Pantheon filters -->
        <FilterPanel
          filterGroup="pantheon"
          groupTitle="By Pantheon"
          ref="pantheonFilterPanel"
          :arrayOfFilterStrings="arrayPantheonFilterStrings"
          @filter-change="filterChanged"
        />
        <!-- Damage type filters -->
        <FilterPanel
          filterGroup="damage"
          groupTitle="By Damage Type"
          ref="damageFilterPanel"
          :arrayOfFilterStrings="arrayDamageType"
          @filter-change="filterChanged"
        />
        <!-- Basic attack type filters -->
        <FilterPanel
          filterGroup="basic"
          groupTitle="By Basic Attack Type"
          ref="basicFilterPanel"
          :arrayOfFilterStrings="arrayBasicAttackType"
          @filter-change="filterChanged"
        />

        <div class="row justify-content-center">
          <div class="col-auto">
            <button class="btn btn-dark" type="button" @click="resetAllFilters">
              Reset All
            </button>
          </div>
        </div>
      </div>

      <!-- Second col is character section -->
      <div class="col border border-secondary">
        <!-- First inner row is the search bar -->
        <div class="row p-2">
          <div class="col">
            <input
              v-model="userSearchTerm"
              type="text"
              class="form-control"
              placeholder="Search term..."
            />
          </div>
        </div>

        <!-- Second inner row is the characters list -->
        <div class="row god-list-height">
          <div class="col mh-100 overflow-auto">
            <!-- Each row is a chunk of arrayChunk. -->
            <div
              class="row m-3 border border-warning"
              v-for="(chunk, index) in filteredGodsArray"
              :key="index"
            >
              <!-- Each of these col's is a item in chunk, in this case it's the characters. -->
              <div class="col-auto" v-for="god in chunk" :key="god.id">
                <GodCard
                  :id="god.id"
                  :godName="god.Name"
                  :iconUrl="god.godIcon_URL"
                >
                </GodCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GodCard from "../../components/Gods/GodCard.vue";
import FilterPanel from "../../components/Gods/FilterPanel.vue";

/**
 * @author Patrick W.
 * @description The selector page is part of the create group. This is where a user can search, filter and select a character
 * to make a build on.
 * Layout: public - all user can access this page
 */
export default {
  head: {
    title: "Select Character",
  },
  name: "selector",
  layout: "public",
  components: {
    GodCard,
    FilterPanel,
  },
  data: function () {
    return {
      userSearchTerm: "",
      godsArray: [],
      /**
       * Todo later (maybe): actually pull these from the gods when loaded on mounted,
       * instead of hardcoding them like this.
       */
      arrayClassFilterStrings: [
        "Assassin",
        "Guardian",
        "Hunter",
        "Mage",
        "Warrior",
      ],
      arrayPantheonFilterStrings: [
        "Arthurian",
        "Babylonian",
        "Celtic",
        "Chinese",
        "Egyptian",
        "Great Old Ones",
        "Greek",
        "Hindu",
        "Japanese",
        "Mayan",
        "Norse",
        "Polynesian",
        "Roman",
        "Slavic",
        "Voodoo",
        "Yoruba",
      ],
      arrayDamageType: ["Magical", "Physical"],
      arrayBasicAttackType: ["Melee", "Ranged"],
      currentlySelectedFilters: {
        godClass: [],
        pantheon: [],
        damage: [],
        basic: [],
      },
    };
  },
  /**
   * @description Async mounted function. When mounted, show the loading bar then use the server API to get the list of gods.
   * Failure displays an error, success saves the gods array.
   * Both results hide the loading overlay when finished.
   */
  mounted: async function () {
    const TAG = "\nselector.vue - mounted(), ";
    console.log(TAG + "loading all gods.");

    // Show loader
    let loader = this.$loading.show();
    let allGodsResponse = await this.$axios.$get(
      `${this.$config.serverUrl}/gods`
    );

    console.log("allGodsResposne: ", allGodsResponse);

    if (allGodsResponse.status === "Failure") {
      this.$notify({
        title: "Create Error",
        text: `An error has occurred: ${allGodsResponse.resData}`,
        duration: 6000,
        type: "error",
      });
      loader.hide();
    } else if (allGodsResponse.status === "Success") {
      this.godsArray = allGodsResponse.resData;
      console.dir(this.godsArray[0]);

      loader.hide();
    }
  },
  computed: {
    /**
     * @description Split the array of gods into chunks so row output is easier.
     */
    arrayChunks: function () {
      return this.lodash.chunk(this.godsArray, 7);
    },
    filteredGodsArray: function () {
      const SELF = this;
      function showThisGod(god) {
        if (SELF.currentlySelectedFilters.godClass.includes(god.Roles)) {
          return true;
        } else {
          return false;
        }
      }
      return this.lodash.chunk(this.godsArray.filter(showThisGod), 7);
      //return this.godsArray.filter(showThisGod);
    },
  },
  methods: {
    /**
     * @description This function fires when any of the FilterPanels checkboxes change.
     * If a filter is changed, update the appropriate array  in the currentlySelectedFilters object.
     */
    filterChanged: function (selectedFilters) {
      const TAG = "\nselector - filterChanged(), ";
      console.log(TAG + "fired.");
      console.dir(selectedFilters);
      this.currentlySelectedFilters[selectedFilters.filterGroup] =
        selectedFilters.selectedFilters;
      console.dir(this.currentlySelectedFilters);
    },
    /**
     * @description Access the $refs and call their uncheckAllFilters function.
     */
    resetAllFilters: function () {
      this.$refs.classFilterPanel.uncheckAllFilters();
      this.$refs.pantheonFilterPanel.uncheckAllFilters();
      this.$refs.damageFilterPanel.uncheckAllFilters();
      this.$refs.basicFilterPanel.uncheckAllFilters();
    },
  },
};
</script>

<style scoped>
.god-list-height {
  height: 80vh;
}
</style>