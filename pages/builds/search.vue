<template>
  <div class="container-fluid">
    <!-- Main outer row contains both columns. -->
    <div class="row ml-4 mr-4">
      <!-- First column is filter column. -->
      <div class="col-3 p-4 border border-primary">
        <!-- Filters Header -->
        <div class="row justify-content-center">
          <div class="col-auto text-center">
            <h2>Filters</h2>
          </div>
        </div>

        <!-- Basic Filters -->
        <FilterPanel
          filterGroup="basic"
          groupTitle="Basic Filters"
          ref="basicFilterPanel"
          :arrayOfFilterStrings="arrayBasicFilterStrings"
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
              placeholder="Search by title and god name..."
            />
          </div>
          <div class="col-3">
            <span>Sort: </span>
            <b-dropdown
              id="dropdown-1"
              :text="currentSortType"
              variant="outline-primary"
              class="ml-4"
            >
              <b-dropdown-item @click="changeSort('Date Added')"
                >Date Added</b-dropdown-item
              >
              <b-dropdown-item @click="changeSort('Build Title')"
                >Build Title</b-dropdown-item
              >
              <b-dropdown-item @click="changeSort('Likes')"
                >Likes</b-dropdown-item
              >
              <b-dropdown-item @click="changeSort('Dislikes')"
                >Dislikes</b-dropdown-item
              >
            </b-dropdown>

            <!-- These two buttons toggle Ascending or Descending sort. -->
            <button
              v-if="sortAscending"
              @click="sortAscending = false"
              title="Ascending"
              type="button"
              class="btn btn-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-sort-up"
                viewBox="0 0 16 16"
              >
                <path
                  d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"
                />
              </svg>
            </button>
            <button
              v-else
              @click="sortAscending = true"
              title="Descending"
              type="button"
              class="btn btn-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-sort-down"
                viewBox="0 0 16 16"
              >
                <path
                  d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Second inner row is the list of build. -->
        <div v-if="buildsReady" class="row build-list-height">
          <div class="col mh-100 overflow-auto">
            <BuildRow
              @click.native="goToBuild(build)"
              class="build-row-class"
              v-for="build in filteredBuildsArray"
              :key="build.id"
              :buildData="build"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports
import BuildRow from "../../components/Builds/BuildRow.vue";
import FilterPanel from "../../components/Gods/FilterPanel.vue";

/**
 * @author Patrick W.
 * @description The builds - search.vue page will display all the builds.
 * Searching, filtering and sorting are available.
 * The filtering is very basic, as someone on this page does not
 * need access to in depth options like the Create pages selection screen.
 */
export default {
  head: {
    title: "Select a Build",
  },
  name: "search",
  layout: "public",
  components: {
    BuildRow,
    FilterPanel,
  },
  data: function () {
    return {
      allBuilds: [],
      // True when builds loaded and ready.
      buildsReady: false,

      // Filter vars.
      userSearchTerm: "",
      arrayBasicFilterStrings: ["My Builds"],
      currentlySelectedFilters: {
        basic: [],
      },

      // Sorting vars.
      currentSortType: "Date Added",
      sortAscending: false,
    };
  },
  /**
   * Get the builds on mounted.
   * Builds consist of 3 'parts' we need to get.
   * 1. The build data.
   * 2. God data for the build, using the god_id associated with the build.
   * 3. The name of the build author, using the owner_id associated with the build.
   */
  mounted: async function () {
    // Set store page name.
    this.$store.commit("navigation/changePage", "Builds");
    // Setup - start the loading overlay.
    let loader = this.$loading.show();

    try {
      // Get all the builds.
      let allBuildsResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/builds`
      );

      if (allBuildsResponse.status !== "Success") {
        throw new Error(allBuildsResponse.resData);
      }

      // Set data variable.
      this.allBuilds = allBuildsResponse.resData;

      // Get the builds god data and author name.
      let index = 0;
      let aLength = this.allBuilds.length;
      while (index < aLength) {
        let godDataResponse = await this.$axios.$get(
          `${this.$config.serverUrl}/gods/${this.allBuilds[index].godId}`
        );
        let getUsernameResponse = await this.$axios.$get(
          `${this.$config.serverUrl}/users/username/${this.allBuilds[index].ownerId}`
        );

        if (godDataResponse.status !== "Success") {
          throw new Error(godDataResponse.resData);
        } else if (getUsernameResponse.status !== "Success") {
          throw new Error(getUsernameResponse.resData);
        }

        // Passed error checking, parse now.
        this.allBuilds[index].godData = godDataResponse.resData;
        this.allBuilds[index].ownerName = getUsernameResponse.resData;

        // Get items
        for (const itemType in this.allBuilds[index].items) {
          for (const itemSlot in this.allBuilds[index].items[itemType]) {
            // item slots CAN be null, only try and get slots that are not null.
            if (this.allBuilds[index].items[itemType][itemSlot]) {
              let singleItemResponse = await this.$axios.$get(
                `${this.$config.serverUrl}/items/${this.allBuilds[index].items[itemType][itemSlot]}`
              );
              if (singleItemResponse.status !== "Success") {
                throw new Error(singleItemResponse.resData);
              } else {
                // Replace ID with actual item data.
                this.allBuilds[index].items[itemType][itemSlot] =
                  singleItemResponse.resData;
              }
            }
          }
        }

        index++;
      }

      // Success!
      loader.hide();
      this.buildsReady = true;
    } catch (error) {
      this.$notify({
        title: "Builds error.",
        text: `An error has occurred: ${error.message}`,
        duration: 6000,
        type: "error",
      });
      loader.hide();
    }
  },
  computed: {
    /**
     * @description Filter the builds according to current filtering, title
     * and sorting options.
     */
    filteredBuildsArray: function () {
      const SELF = this;

      /**
       * @description Check if a build should be shown or not.
       * Defaults to return true, if the build fails any checks
       * return false.
       */
      function showThisBuild(build) {
        if (SELF.currentlySelectedFilters.basic.length !== 0) {
          if (
            SELF.currentlySelectedFilters.basic.includes("My Builds") &&
            (!SELF.$store.state.user.authorized ||
              SELF.$store.state.user.currentUser.userId !== build.ownerId)
          ) {
            return false;
          }
        }

        // Passed filter settings, now check against the search bar.
        if (SELF.userSearchTerm.length !== 0) {
          let combinedTitle = build.title + " " + build.godData.Name;
          let regex = new RegExp(SELF.userSearchTerm, "gi");
          if (!regex.test(combinedTitle)) {
            return false;
          }
        }

        return true;
      }

      // Initial filter.
      let filteredBuilds = this.allBuilds.filter(showThisBuild);
      // Sort builds using sorting functions.
      // a and b are the two builds being compared.
      if (this.currentSortType === "Date Added") {
        filteredBuilds = filteredBuilds.sort((a, b) => {
          if (a.createdDate < b.createdDate) {
            return 1;
          } else if (a.createdDate > b.createdDate) {
            return -1;
          } else {
            return 0;
          }
        });
      } else if (this.currentSortType === "Build Title") {
        filteredBuilds = filteredBuilds.sort((a, b) => {
          if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1;
          } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
            return 1;
          } else {
            return 0;
          }
        });
      } else if (this.currentSortType === "Likes") {
        filteredBuilds = filteredBuilds.sort((a, b) => {
          if (a.likes < b.likes) {
            return 1;
          } else if (a.likes > b.likes) {
            return -1;
          } else {
            return 0;
          }
        });
      } else if (this.currentSortType === "Build") {
        filteredBuilds = filteredBuilds.sort((a, b) => {
          if (a.dislikes < b.dislikes) {
            return 1;
          } else if (a.dislikes > b.dislikes) {
            return -1;
          } else {
            return 0;
          }
        });
      }
      // Reverse or not.
      if (this.sortAscending) {
        filteredBuilds.reverse();
      }
      return filteredBuilds;
    },
  },
  methods: {
    goToBuild: function (build) {
      this.$router.push({ path: `/builds/${build.id}` });
    },
    changeSort: function (sortType) {
      this.currentSortType = sortType;
    },
    /**
     * @description This function fires when any of the FilterPanels checkboxes change.
     * If a filter is changed, update the appropriate array  in the currentlySelectedFilters object.
     */
    filterChanged: function (selectedFilters) {
      this.currentlySelectedFilters[selectedFilters.filterGroup] =
        selectedFilters.selectedFilters;
    },
    resetAllFilters: function () {
      this.$refs.basicFilterPanel.uncheckAllFilters();
    },
  },
};
</script>

<style scoped>
.build-list-height {
  height: 80vh;
}
.build-row-class {
  transition: transform 0.2s;
}
.build-row-class:hover {
  cursor: pointer;
  transform: scale(0.97);
}
</style>
