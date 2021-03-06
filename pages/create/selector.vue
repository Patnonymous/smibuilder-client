<template>
  <div class="container-fluid">
    <!-- Main outer row contains both columns. -->
    <div class="row ml-4 mr-4">
      <!-- First col is filter column -->
      <div class="col-3 p-4">
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
      <div class="col">
        <!-- First inner row is the search bar -->
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

        <!-- Second inner row is the characters list -->
        <div class="row god-list-height">
          <div class="col mh-100 overflow-auto">
            <!-- Each row is a chunk of arrayChunk. -->
            <div
              class="row m-3"
              v-for="(chunk, index) in filteredGodsArray"
              :key="index"
            >
              <!-- Each of these col's is a item in chunk, in this case it's the characters. -->
              <div class="col-auto" v-for="god in chunk" :key="god.id">
                <GodCard
                  :id="god.id"
                  :godName="god.Name"
                  :iconUrl="god.godIcon_URL"
                  @click.native="godSelected(god.id)"
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
        "Maya",
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
    // Set store page name.
    this.$store.commit("navigation/changePage", "Create");
    // Show loader
    let loader = this.$loading.show();
    let allGodsResponse = await this.$axios.$get(
      `${this.$config.serverUrl}/gods`
    );

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
      loader.hide();
    }
  },
  computed: {
    /**
     * @description Runs a filter on every god to determine if they should be displayed or not.
     * @returns {Array} Chunked array.
     */
    filteredGodsArray: function () {
      const SELF = this;
      /**
       * @description Function to be used in a filter. Determines whether or not a god should be displayed.
       * First it handles the god. Type because in the api JSON data it's in the format of a single string. Ex. "Ranged, Magical"
       * Split the type on ',', remove whitespace, split them further into a Basic Attack type array and a Damage type array.
       *
       * Second it checks against the filter panel settings.
       * Third it checks against the search bar at the time.
       */
      function showThisGod(god) {
        // Crazy ugly, but might account for god data changes, such as a new Basic Attack type.
        const splitted = god.Type.replace(/\s/g, "").split(",");
        let godBasicAttackTypes = [];
        let godDamageTypes = [];
        for (const indexInSplitted in splitted) {
          if (
            splitted[indexInSplitted] === "Ranged" ||
            splitted[indexInSplitted] === "Melee"
          ) {
            godBasicAttackTypes.push(splitted[indexInSplitted]);
          } else {
            godDamageTypes.push(splitted[indexInSplitted]);
          }
        }
        if (
          SELF.currentlySelectedFilters.godClass.length !== 0 &&
          !SELF.currentlySelectedFilters.godClass.includes(god.Roles)
        ) {
          return false;
        } else if (
          SELF.currentlySelectedFilters.pantheon.length !== 0 &&
          !SELF.currentlySelectedFilters.pantheon.includes(god.Pantheon)
        ) {
          return false;
        } else if (SELF.currentlySelectedFilters.damage.length !== 0) {
          /**
           * Also ugly, but can account for a use case where a god has multiple damage types listed.
           */
          let index = 0;
          let aLength = godDamageTypes.length;
          while (index < aLength) {
            if (
              !SELF.currentlySelectedFilters.damage.includes(
                godDamageTypes[index]
              )
            ) {
              return false;
            }
            index++;
          }
        } else if (SELF.currentlySelectedFilters.basic.length !== 0) {
          /**
           * For some reason Persephone's basic attack type isn't specified in the api JSON.
           * In the game her basic attacks are ranged so use a special check for that.
           */
          if (
            god.Name === "Persephone" &&
            !SELF.currentlySelectedFilters.basic.includes("Ranged")
          ) {
            return false;
          } else {
            /**
             * Same thing as above, accounts for a god having multiple basic attack types.
             */
            let index = 0;
            let aLength = godBasicAttackTypes.length;
            while (index < aLength) {
              if (
                !SELF.currentlySelectedFilters.basic.includes(
                  godBasicAttackTypes[index]
                )
              ) {
                return false;
              }
              index++;
            }
          }
        }

        // Passed filter settings, now check against the search bar.
        if (SELF.userSearchTerm.length !== 0) {
          let regex = new RegExp(SELF.userSearchTerm, "gi");
          if (!regex.test(god.Name)) {
            return false;
          }
        }

        return true;
      }
      return this.lodash.chunk(this.godsArray.filter(showThisGod), 7);
    },
  },
  methods: {
    /**
     * @description This function fires when any of the FilterPanels checkboxes change.
     * If a filter is changed, update the appropriate array  in the currentlySelectedFilters object.
     */
    filterChanged: function (selectedFilters) {
      this.currentlySelectedFilters[selectedFilters.filterGroup] =
        selectedFilters.selectedFilters;
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
    godSelected: function (godId) {
      let selectedGod = this.godsArray.filter((godObj) => {
        return godObj.id === godId;
      })[0];
      this.$router.push({ path: `/create/${godId}` });
    },
  },
};
</script>

<style scoped>
.god-list-height {
  height: 80vh;
}
</style>