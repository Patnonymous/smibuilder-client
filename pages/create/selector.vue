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
          filterGroup="Class"
          :arrayOfFilterStrings="arrayClassFilterStrings"
        />
        <!-- Pantheon filters -->
        <FilterPanel
          filterGroup="Pantheon"
          :arrayOfFilterStrings="arrayPantheonFilterStrings"
        />
        <!-- Damage type filters -->
        <FilterPanel
          filterGroup="Damage Type"
          :arrayOfFilterStrings="arrayDamageType"
        />
        <!-- Basic attack type filters -->
        <FilterPanel
          filterGroup="Basic Attack Type"
          :arrayOfFilterStrings="arrayBasicAttackType"
        />
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
              v-for="(chunk, index) in arrayChunks"
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
    };
  },
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
  },
  methods: {},
};
</script>

<style scoped>
.god-list-height {
  height: 80vh;
}
</style>