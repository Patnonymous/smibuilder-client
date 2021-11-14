<template>
  <modal :name="name" :reset="true" height="auto">
    <div class="m-2">
      <form @submit.prevent="publishBuild">
        <div class="form-group">
          <label for="inputBuildTitle">Build Title</label>
          <input
            required
            maxlength="85"
            type="text"
            class="form-control"
            id="inputBuildTitle"
            placeholder="A nice title..."
            v-model="userInputBuildTitle"
          />
        </div>

        <div class="form-group">
          <label for="textAreaBuildDescription">Build Description</label>
          <textarea
            required
            maxlength="200"
            class="form-control"
            id="textAreaBuildDescription"
            rows="3"
            v-model="userInputBuildDescription"
          ></textarea>
        </div>

        <div class="form-group">
          <p class="text-danger" v-if="errorMessage !== null">
            {{ errorMessage }}
          </p>
        </div>

        <button
          v-if="$store.state.user.authorized"
          type="submit"
          class="mb-2 btn btn-primary float-right"
          :disabled="errorMessage !== null"
        >
          Publish Build
        </button>
      </form>
    </div>
  </modal>
</template>

<script>
export default {
  name: "BuildPublishModal",
  components: {},
  props: {
    name: {
      type: String,
      required: true,
    },
    itemIds: {
      type: Object,
      required: true,
    },
    godId: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      userInputBuildTitle: "",
      userInputBuildDescription: "",
      errorMessage: null,
    };
  },
  mounted: async function () {},
  computed: {},
  methods: {
    publishBuild: async function (event) {
      const TAG = "BuildPublishModal - publishBuild(), ";
      console.log(TAG + "publishing");
      console.log("title: ", this.userInputBuildTitle);
      console.log("description: ", this.userInputBuildDescription);
      console.log("itemIds: ");
      console.dir(this.itemIds);

      // Var work.
      this.errorMessage = null;
      let buildTitle = this.userInputBuildTitle.trim();
      let buildDescription = this.userInputBuildDescription.trim();
      //let userId = this.$store.state.

      // Do some client side error checking.
      if (!this.$store.state.user.authorized) {
        this.errorMessage = "Please log in to publish.";
      } else if (buildTitle.length === 0) {
        this.errorMessage = "Title cannot be blank.";
      } else if (buildTitle.length > 85) {
        this.errorMessage = "Title length cannot exceed 85 chars.";
      } else if (buildDescription.length === 0) {
        this.errorMessage = "Description cannot be blank.";
      } else if (buildDescription.length > 200) {
        this.errorMessage = "Description cannot exceed 200 chars.";
      }

      // Passed error checks. If errorMessage is null then it's good input.
      if (this.errorMessage === null) {
        try {
          let buildPublishResponse = await this.$axios.$post(
            `${this.$config.serverUrl}/builds/create`,
            {
              buildOwnerId: this.$store.state.user.currentUser.userId,
              buildTitle: buildTitle,
              buildDescription: buildDescription,
              buildItems: this.itemIds,
              buildGodId: this.godId,
            }
          );

          console.log("buildPublishResponse: ");
          console.log(buildPublishResponse);

          if (buildPublishResponse.status === "Failure") {
            this.$notify({
              title: "Build Publish Error",
              text: `An error has occurred: ${buildPublishResponse.resData}`,
              duration: 6000,
              type: "error",
            });
          } else if (buildPublishResponse.status === "Success") {
            this.$notify({
              title: "Build Publish",
              text: `Your build has been published.`,
              duration: 3000,
              type: "success",
            });
            this.$router.push({ path: "/builds/search" });
          }
        } catch (error) {
          console.log("ERROR: ");
          console.error(error);
          this.$notify({
            title: "Build Publish Error",
            text: `An error has occurred: ${error.message}`,
            duration: 6000,
            type: "error",
          });
        }
      }
    },
  },
  watch: {
    itemIds: function (newItems) {
      let emptyBuild = true;
      for (const itemCategory in newItems) {
        for (const item in newItems[itemCategory]) {
          if (newItems[itemCategory][item] !== null) {
            emptyBuild = false;
          }
        }
      }
      if (emptyBuild) {
        this.errorMessage =
          "It seems your build is completely empty. Please choose at least 1 item.";
      } else {
        this.errorMessage = null;
      }
    },
  },
};
</script>
