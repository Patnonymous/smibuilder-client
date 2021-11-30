<template>
  <div class="row mt-2 mb-2 border border-primary rounded">
    <!-- Col for likes and dislikes. -->
    <div class="col-auto">
      <div class="row mt-3">
        <div class="col">
          <span class="text-success">{{ buildData.likes }} likes</span>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col">
          <span class="text-danger">{{ buildData.dislikes }} dislikes</span>
        </div>
      </div>
    </div>

    <!-- Col for tiny god card img preview -->
    <div class="col-auto">
      <div class="col p-1 bg-dark rounded text-center">
        <div class="card" style="width: 5rem; height: 5rem">
          <img
            v-b-tooltip.hover
            :title="buildData.godData.Name"
            class="card-img-top"
            :src="buildData.godData.godIcon_URL"
            alt="God Icon"
          />
        </div>
      </div>
    </div>

    <!-- Col for build preview. -->
    <div class="col">
      <!-- Row for build title and creator. -->
      <div class="row">
        <div class="col">
          <h4>{{ buildData.title }} - {{ buildData.godData.Name }}</h4>
        </div>
        <div class="col-auto mt-2">
          <h5>By {{ buildData.ownerName }}</h5>
        </div>
        <!-- Optional col for BuildRows on the favourites page. -->
        <div v-if="favouritesPage" class="col-auto mt-2">
          <button
            type="button"
            class="btn btn-outline-danger w-100"
            @click.stop="removeFromFavourites"
          >
            Remove From Favourites
          </button>
        </div>
      </div>
      <!-- Row for the build preview.
      We want to display the slots, regardless if there's an item in it or not
      so ItemFrame's can be used here. -->
      <div class="row">
        <!-- Consumables -->
        <div class="col-auto bg-info rounded m-2">
          <div class="row">
            <ItemFrameTiny
              class="m-1"
              v-for="(consumable, index) in buildData.items.consumables"
              :key="index"
              :itemData="consumable"
              frameType="consumable"
            />
          </div>
        </div>
        <!-- Relics -->
        <div class="col-auto bg-info rounded m-2">
          <div class="row">
            <ItemFrameTiny
              class="m-1"
              v-for="(relic, index) in buildData.items.relics"
              :key="index"
              :itemData="relic"
              frameType="relic"
            />
          </div>
        </div>
        <!-- Main Items -->
        <div class="col-auto bg-info rounded m-2">
          <div class="row">
            <ItemFrameTiny
              class="m-1"
              v-for="(item, index) in buildData.items.mainItems"
              :key="index"
              :itemData="item"
              frameType="item"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports
import ItemFrameTiny from "../Items/ItemFrameTiny.vue";
/**
 * @author Patrick W.
 * @description BuildRow component is the preview for a build, for use in the Builds Search screen.
 * This displays the builds title, likes and dislikes, associated god name and icon,
 * consumables, relics, and the main items.
 * Users can click this to take them to the builds in depth display page.
 * BuildRow on the Favourites page have special functionality where they get a new button to remove
 * them from fav's.
 */
export default {
  name: "BuildRow",
  components: {
    ItemFrameTiny,
  },
  props: {
    buildData: {
      type: Object,
      required: true,
    },
    // Enables special formatting and behavior for BuildRows on the favourites page.
    favouritesPage: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: function () {
    return {};
  },
  mounted: async function () {},
  computed: {},
  methods: {
    removeFromFavourites: async function () {
      let removeFavouriteResponse = await this.$axios.$post(
        `${this.$config.serverUrl}/favourites/remove`,
        {
          buildId: this.buildData.id,
          userId: this.$store.state.user.currentUser.userId,
          token: this.$cookies.get("auth"),
        }
      );

      if (removeFavouriteResponse.status === "Failure") {
        this.$notify({
          title: "Favourite error.",
          text: `An error has occurred: ${error.message}`,
          duration: 6000,
          type: "error",
        });
      } else if (removeFavouriteResponse.status === "Success") {
        this.$notify({
          title: "Favourite.",
          text: removeFavouriteResponse.resData,
          duration: 3000,
          type: "success",
        });
        this.$emit("buildRemovedFromFavourites", this.buildData.id);
      }
    },
  },
};
</script>
