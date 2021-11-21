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
              placeholder="Search by title..."
            />
          </div>
        </div>

        <!-- Second inner row is the list of build. -->
        <div v-if="buildsReady" class="row build-list-heightt">
          <div class="col mh-100 overflow-auto">
            <BuildRow
              v-for="build in allBuilds"
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
export default {
  name: "search",
  layout: "public",
  components: {
    BuildRow,
  },
  data: function () {
    return {
      allBuilds: [],
      userSearchTerm: "",
      buildsReady: false,
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
    const TAG = "builds search - async mounted(), ";
    console.log(TAG + "loading all the builds.");

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
  computed: {},
  methods: {
    resetAllFilters: function () {
      console.log(this.allBuilds);
    },
  },
};
</script>

<style scoped>
.build-list-height {
  height: 80vh;
}
</style>
