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
              @keyup="debounceSearchStringChanged"
              type="text"
              class="form-control"
              placeholder="Search by build title..."
            />
          </div>
          <div class="col-3">
            <span>Sort: </span>
            <b-dropdown
              id="dropdown-1"
              :text="currentSortType"
              variant="outline-primary"
              class="ml-4"
              :disabled="totalNumberOfPages === 0"
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
              @click="changeAscending(false)"
              title="Ascending"
              type="button"
              class="btn btn-primary"
              :disabled="totalNumberOfPages === 0"
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
              @click="changeAscending(true)"
              title="Descending"
              type="button"
              class="btn btn-primary"
              :disabled="totalNumberOfPages === 0"
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

          <!-- Page controls. -->
          <div class="col">
            <span class="text-dark">Page: </span>
            <!-- First page button. -->
            <button
              type="button"
              class="btn btn-outline-primary"
              title="First Page"
              @click="goToFirstPage"
              :disabled="totalNumberOfPages === 0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chevron-double-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
                <path
                  fill-rule="evenodd"
                  d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </button>
            <!-- Back 1 page button.  -->
            <button
              type="button"
              class="btn btn-outline-primary"
              title="Previous Page"
              @click="decrementPage"
              :disabled="totalNumberOfPages === 0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chevron-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </button>
            <!-- Current Page -->
            <button type="button" class="btn btn-primary" disabled>
              {{ currentPage }}
            </button>
            <!-- Forward 1 page button. -->
            <button
              type="button"
              class="btn btn-outline-primary"
              title="Next Page"
              @click="incrementPage"
              :disabled="totalNumberOfPages === 0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chevron-right"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
            <!-- Last page button. -->
            <button
              type="button"
              class="btn btn-outline-primary"
              title="Last Page"
              @click="goToLastPage"
              :disabled="totalNumberOfPages === 0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chevron-double-right"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                />
                <path
                  fill-rule="evenodd"
                  d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
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
              v-for="build in filteredBuilds"
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
import _ from "lodash";

/**
 * @description Displays all the builds.
 * Paginated at 5 per page.
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
      // Pagination vars.
      totalNumberOfPages: 0,
      currentPage: 0,
    };
  },
  mounted: async function () {
    // Set store page name.
    this.$store.commit("navigation/changePage", "Builds");

    // Get Pagination info.
    let areThereBuilds = await this.getPaginationInfoBuilds();
    if (areThereBuilds) {
      this.currentPage = 1;
      this.getBuildsPaginated();
    }
  },
  computed: {
    filteredBuilds: function () {
      let filteredBuilds = this.allBuilds.filter((build) => {
        if (
          this.currentlySelectedFilters.basic.includes("My Builds") &&
          build.ownerId !== this.$store.state.user.currentUser.userId
        ) {
          return false;
        }
        return true;
      });
      return filteredBuilds;
    },
  },
  methods: {
    getPaginationInfoBuilds: async function () {
      let paginationInfoResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/builds/pagination-info/${this.userSearchTerm}`
      );
      if (paginationInfoResponse.status === "Failure") {
        this.$notify({
          title: "Pagination Error",
          text: `An error has occurred: ${paginationInfoResponse.resData}`,
          duration: 6000,
          type: "error",
        });
        return false;
      } else if (paginationInfoResponse.status === "Success") {
        this.totalNumberOfPages = paginationInfoResponse.resData;
        if (this.totalNumberOfPages > 0) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    getBuildsPaginated: async function () {
      // Setup - start the loading overlay.
      let loader = this.$loading.show();
      let paginatedBuildsResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/builds/${this.currentPage}/${this.currentSortType}/${this.sortAscending}/${this.userSearchTerm}`
      );

      if (paginatedBuildsResponse.status === "Failure") {
        this.$notify({
          title: "Builds Error",
          text: `An error has occurred: ${paginatedBuildsResponse.resData}`,
          duration: 6000,
          type: "error",
        });
        loader.hide();
      } else if (paginatedBuildsResponse.status === "Success") {
        this.allBuilds = paginatedBuildsResponse.resData;
        this.buildsReady = true;
        loader.hide();
      }
    },
    goToBuild: function (build) {
      this.$router.push({ path: `/builds/${build.id}` });
    },
    changeSort: function (sortType) {
      this.currentSortType = sortType;
      this.currentPage = 1;
      this.getBuildsPaginated();
    },
    changeAscending: function (ascendBool) {
      this.sortAscending = ascendBool;
      this.currentPage = 1;
      this.getBuildsPaginated();
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
    /**
     * @description Sets currentPage to 1.
     * Does nothing if totalNumberOfPages is 0 (that means no comments).
     */
    goToFirstPage: function () {
      if (this.totalNumberOfPages > 0) {
        this.currentPage = 1;
        this.getBuildsPaginated();
      }
    },
    /**
     * @description Decrements currentPage by 1 if currentPage is greater than 1.
     */
    decrementPage: function () {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.getBuildsPaginated();
      }
    },
    /**
     * @description Increments currentPage by 1 if currentPage is les than totalNumberOfPages.
     */
    incrementPage: function () {
      if (this.currentPage < this.totalNumberOfPages) {
        this.currentPage++;
        this.getBuildsPaginated();
      }
    },
    /**
     * @description Sets currentPage to 1.
     * Does nothing if totalNumberOfPages is 0 (that means no comments).
     */
    goToLastPage: function () {
      if (this.totalNumberOfPages > 0) {
        this.currentPage = this.totalNumberOfPages;
        this.getBuildsPaginated();
      }
    },
    debounceSearchStringChanged: _.debounce(async function (e) {
      let areThereBuilds = await this.getPaginationInfoBuilds();
      if (areThereBuilds) {
        this.currentPage = 1;
        this.getBuildsPaginated();
      } else {
        this.currentPage = 0;
        this.allBuilds.length = 0;
      }
    }, 1000),
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
