<template>
  <div v-if="validBuild" class="container-fluid">
    <!-- First row shows likes, dislikes and build info. -->
    <div class="row ml-1 mr-1 bg-light rounded">
      <!-- Left Side Col is rating and favourite buttons. -->
      <div class="col-2">
        <div class="row m-2">
          <div class="col">
            <button
              class="btn btn-outline-success w-100"
              type="button"
              @click="likeThisBuild"
            >
              Like
            </button>
          </div>
        </div>
        <div class="row m-2">
          <div class="col">
            <button
              class="btn btn-outline-danger w-100"
              type="button"
              @click="dislikeThisBuild"
            >
              Dislike
            </button>
          </div>
        </div>
        <div class="row m-2">
          <div class="col">
            <button
              v-if="!buildAlreadyFavourited"
              class="btn btn-outline-primary w-100"
              type="button"
              @click="favouriteThisBuild"
            >
              Favourite
            </button>
            <button
              v-else
              class="btn btn-outline-dark w-100"
              type="button"
              disabled
            >
              Already Favourited
            </button>
          </div>
        </div>
      </div>

      <!-- Right side col is build title and description. -->
      <div class="col">
        <div class="row">
          <div class="col">
            <h3>
              {{ buildData.title }} - By {{ buildData.ownerName }} - Created
              {{ displayDatePretty }}
            </h3>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h4>{{ buildData.description }}</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Second row shoes god and build info. -->
    <div class="row ml-1 mr-1">
      <!-- Left side col will hold the god, their stats, level info etc. -->
      <div class="col-3 border border-primary">
        <GodPanel
          :godObject="buildData.godData"
          :godDamageType="godDamageType"
        />
      </div>

      <!-- Right side col will hold the tags, abilities, items, and publish buttons -->
      <div class="col ml-2 border border-warning">
        <!-- This row will hold tags -->
        <div class="row bg-secondary text-white justify-content-center">
          <div class="col">
            <div class="row justify-content-center text-center">
              <div class="col">
                <h1>Tags</h1>
              </div>
            </div>
            <GodTagsMain
              :godObject="buildData.godData"
              :godDamageType="godDamageType"
              :godBasicAttackType="godBasicAttackType"
            />
          </div>
        </div>
        <!-- This row will hold ability icons -->
        <div class="row mt-2 bg-secondary text-white justify-content-center">
          <div class="col">
            <div class="row justify-content-center text-center">
              <div class="col">
                <h1>Abilities</h1>
              </div>
            </div>
            <GodAbilitiesMain
              :ability1="buildData.godData.Ability_1"
              :ability2="buildData.godData.Ability_2"
              :ability3="buildData.godData.Ability_3"
              :ability4="buildData.godData.Ability_4"
              :ability5="buildData.godData.Ability_5"
            />
          </div>
        </div>

        <!-- This row will hold the items. -->
        <div
          class="row mt-2 p-2 bg-secondary text-white justify-content-center"
        >
          <BuildItemsMain
            :godRole="buildData.godData.Roles"
            :godDamageType="godDamageType"
            :godBasicAttackType="godBasicAttackType"
            :godName="buildData.godData.Name"
            :consumablesObject="buildData.items.consumables"
            :relicsObject="buildData.items.relics"
            :mainItemsObject="buildData.items.mainItems"
            :extrasObject="buildData.items.extraItems"
          />
        </div>
      </div>
    </div>

    <!-- This row holds comments. -->
    <div class="row m-1 bg bg-secondary text-white">
      <CommentsWidget :buildId="buildData.id" />
    </div>
  </div>
</template>

<script>
// Imports
import GodPanel from "../../components/Gods/GodPanel.vue";
import GodTagsMain from "../../components/Tags/GodTagsMain.vue";
import GodAbilitiesMain from "../../components/Abilities/GodAbilitiesMain.vue";
import BuildItemsMain from "../../components/Builds/BuildItemsMain.vue";
import CommentsWidget from "../../components/Comments/CommentsWidget.vue";
import Cookies from "js-cookie";
export default {
  head: {
    title: "View A Build",
  },
  layout: "public",
  components: {
    GodPanel,
    GodTagsMain,
    GodAbilitiesMain,
    BuildItemsMain,
    CommentsWidget,
  },
  async asyncData({ params }) {
    const buildId = params.buildId;
    return { buildId };
  },
  data: function () {
    return {
      buildData: {},
      validBuild: false,
      buildAlreadyFavourited: false,
      /** Magical or Physical */
      godDamageType: null,
      /** Melee or Ranged */
      godBasicAttackType: null,
    };
  },

  /**
   * @description Get the build data on mounted.
   * Gets the build data.
   * Gets the god data and owner name for the build.
   * Gets the data for each item in the build.
   * If successful, sets the validBuild bool to true so it will display.
   */
  mounted: async function () {
    let loader = this.$loading.show();
    try {
      // Get main build data.
      let getBuildResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/builds/${this.buildId}`
      );
      if (getBuildResponse.status !== "Success") {
        throw new Error(getBuildResponse.resData);
      }
      // Set build data.
      this.buildData = getBuildResponse.resData;

      // Get god data.
      let godDataResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/gods/${this.buildData.godId}`
      );
      // Get owner name.
      let getUsernameResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/users/username/${this.buildData.ownerId}`
      );

      // Error check.
      if (godDataResponse.status !== "Success") {
        throw new Error(godDataResponse.resData);
      } else if (getUsernameResponse.status !== "Success") {
        throw new Error(getUsernameResponse.resData);
      }

      // Good data.
      this.buildData.godData = godDataResponse.resData;
      this.buildData.ownerName = getUsernameResponse.resData;
      // Have to set god basic attack type and damage type.
      /**
       * For some reason Persephone's basic attack type isn't specified in the api JSON.
       * In the game her basic attacks are ranged so use a special check for that.
       */
      if (this.buildData.godData.Name === "Persephone") {
        this.godBasicAttackType = "Ranged";
      }

      // Successfully got the data. Now set damage type and attack type for easy access.
      const splitted = this.buildData.godData.Type.replace(/\s/g, "").split(
        ","
      );

      for (const splittedIndex in splitted) {
        if (splitted[splittedIndex] === "Ranged") {
          this.godBasicAttackType = "Ranged";
        } else if (splitted[splittedIndex] === "Melee") {
          this.godBasicAttackType = "Melee";
        } else if (splitted[splittedIndex] === "Physical") {
          this.godDamageType = "Physical";
        } else if (splitted[splittedIndex] === "Magical") {
          this.godDamageType = "Magical";
        }
      }

      // Get the items data.
      for (const itemType in this.buildData.items) {
        for (const itemSlot in this.buildData.items[itemType]) {
          // item slots CAN be null, only try and get slots that are not null.
          if (this.buildData.items[itemType][itemSlot]) {
            let singleItemResponse = await this.$axios.$get(
              `${this.$config.serverUrl}/items/${this.buildData.items[itemType][itemSlot]}`
            );
            if (singleItemResponse.status !== "Success") {
              throw new Error(singleItemResponse.resData);
            } else {
              // Replace ID with actual item data.
              this.buildData.items[itemType][itemSlot] =
                singleItemResponse.resData;
            }
          }
        }
      }

      // Check if the user has already favourited this build.
      let favouriteCheckResponse = await this.$axios.$post(
        `${this.$config.serverUrl}/favourites/check`,
        {
          userId: this.$store.state.user.currentUser.userId,
          buildId: this.buildData.id,
          token: Cookies.get("auth"),
        }
      );
      if (favouriteCheckResponse.status === "Failure") {
        throw new Error(
          `Error determining if the build is favourited. Error: ${favouriteCheckResponse.resData}`
        );
      } else if (favouriteCheckResponse.status === "Success") {
        this.buildAlreadyFavourited = favouriteCheckResponse.resData;
      }

      // Success!
      loader.hide();
      this.validBuild = true;
    } catch (error) {
      console.log("ERROR: ");
      console.error(error);
      this.$notify({
        title: "Build Error",
        text: `An error has occurred: ${error.message}`,
        duration: 6000,
        type: "error",
      });
      loader.hide();
    }
  },
  computed: {
    displayDatePretty: function () {
      return new Date(this.buildData.createdDate).toUTCString();
    },
  },
  methods: {
    likeThisBuild: async function () {
      let likeBuildResponse = await this.$axios.$post(
        `${this.$config.serverUrl}/builds/like/${this.buildData.id}`,
        {
          token: Cookies.get("auth"),
        }
      );
      if (likeBuildResponse.status === "Failure") {
        this.$notify({
          title: "Like Error",
          text: `An error occurred when liking the build: ${likeBuildResponse.resData}`,
          duration: 6000,
          type: "error",
        });
      } else if (likeBuildResponse.status === "Success") {
        this.$notify({
          title: "Like",
          text: "Build successfully liked.",
          duration: 3000,
          type: "success",
        });
      }
    },
    dislikeThisBuild: async function () {
      let dislikeBuildResponse = await this.$axios.$post(
        `${this.$config.serverUrl}/builds/dislike/${this.buildData.id}`,
        {
          token: Cookies.get("auth"),
        }
      );
      if (dislikeBuildResponse.status === "Failure") {
        this.$notify({
          title: "Like Error",
          text: `An error occurred when liking the build: ${dislikeBuildResponse.resData}`,
          duration: 6000,
          type: "error",
        });
      } else if (dislikeBuildResponse.status === "Success") {
        this.$notify({
          title: "Like",
          text: "Build successfully disliked.",
          duration: 3000,
          type: "success",
        });
      }
    },
    favouriteThisBuild: async function () {
      let favouriteBuildResponse = await this.$axios.$post(
        `${this.$config.serverUrl}/favourites`,
        {
          userId: this.$store.state.user.currentUser.userId,
          buildId: this.buildData.id,
          token: Cookies.get("auth"),
        }
      );
      if (favouriteBuildResponse.status === "Failure") {
        this.$notify({
          title: "Favourite Error",
          text: `An error occurred when attempting to favourite: ${favouriteBuildResponse.resData}`,
          duration: 6000,
          type: "error",
        });
      } else if (favouriteBuildResponse.status === "Success") {
        this.$notify({
          title: "Favourite",
          text: favouriteBuildResponse.resData,
          duration: 3000,
          type: "success",
        });
        this.buildAlreadyFavourited = true;
      }
    },
  },
};
</script>
