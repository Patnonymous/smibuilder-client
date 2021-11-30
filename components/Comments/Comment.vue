<template>
  <div class="row m-2 border border-primary rounded">
    <div class="col">
      <!-- Rows holds rating, author name, and date. -->
      <div class="row">
        <div class="col-2">
          <h5
            :class="{
              'text-success': positiveComment,
              'text-danger': !positiveComment,
            }"
          >
            Rating: {{ commentData.rating }}
          </h5>
        </div>
        <div class="col">
          <h5>Posted by {{ commentData.ownerName }}</h5>
        </div>
        <div class="col">
          <h5 class="float-right">Posted {{ displayDatePretty }}</h5>
        </div>
      </div>

      <!-- Row holds rating buttons and the comment text. -->
      <div class="row">
        <div class="col-auto">
          <div class="row mt-1 mb-1">
            <div class="col">
              <button
                type="button"
                class="btn btn-outline-success w-100"
                @click="rateUp"
              >
                Rate Up
              </button>
            </div>
          </div>
          <div class="row mt-1 mb-1">
            <div class="col">
              <button
                type="button"
                class="btn btn-outline-danger w-100"
                @click="rateDown"
              >
                Rate Down
              </button>
            </div>
          </div>
        </div>
        <div class="col">
          <!-- Display text area if editing. -->
          <div v-if="editingMode" class="form-group">
            <textarea
              v-model="userInputCommentEdit"
              class="form-control"
              id="textAreaEdit"
              rows="3"
              placeholder="Your edit here..."
              maxlength="255"
            ></textarea>
          </div>
          <h5 v-else>'{{ commentData.commentText }}'</h5>
          <div v-if="errorMessage" class="form-group">
            <p class="text-danger" v-if="errorMessage !== null">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Row holds controls for comment owners. -->
      <div
        v-if="
          $store.state.user.authorized &&
          $store.state.user.currentUser.userId === commentData.ownerId
        "
        class="row mb-2 justify-content-end"
      >
        <div class="col">
          <!-- Display normal buttons when not in editing mode. -->
          <div v-if="!editingMode" class="row justify-content-end">
            <div class="col-auto">
              <button
                type="button"
                class="btn btn-outline-primary w-100"
                @click="toggleEditingMode(true)"
              >
                Edit
              </button>
            </div>
            <div class="col-auto">
              <button
                type="button"
                class="btn btn-outline-danger w-100"
                @click="deleteComment"
              >
                Delete
              </button>
            </div>
          </div>
          <!-- Display editing controls when editing. -->
          <div v-else class="row justify-content-end">
            <div class="col-auto">
              <button
                type="button"
                class="btn btn-outline-success w-100"
                @click="submitCommentEdit"
              >
                Confirm Edit
              </button>
            </div>
            <div class="col-auto">
              <button
                type="button"
                class="btn btn-outline-danger w-100"
                @click="toggleEditingMode(false)"
              >
                Cancel edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports.
import Cookies from "js-cookie";
export default {
  name: "Comment",
  components: {},
  props: {
    commentData: {
      type: Object,
      required: true,
    },
    commentIndex: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      editingMode: false,
      userInputCommentEdit: "",
      errorMessage: null,
    };
  },
  mounted: async function () {},
  computed: {
    displayDatePretty: function () {
      return new Date(this.commentData.createdOn).toUTCString();
    },
    positiveComment: function () {
      if (this.commentData.rating > -1) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    toggleEditingMode: function (toggleOn) {
      if (toggleOn) {
        this.userInputCommentEdit = this.commentData.commentText;
        this.editingMode = true;
      } else {
        this.userInputCommentEdit = "";
        this.errorMessage = null;
        this.editingMode = false;
      }
    },
    submitCommentEdit: async function () {
      this.errorMessage = null;
      // Trim.
      let commentText = this.userInputCommentEdit.trim();
      // Error check.
      if (commentText.length < 1) {
        this.errorMessage = "Comment is blank.";
      } else if (commentText.length > 254) {
        this.errorMessage = "Comment length exceeds maximum (254).";
      }

      // Continue if no error.
      if (!this.errorMessage) {
        let editResponse = await this.$axios.$post(
          `${this.$config.serverUrl}/comments/edit/${this.commentData.id}`,
          {
            token: Cookies.get("auth"),
            newCommentText: commentText,
          }
        );

        if (editResponse.status === "Failure") {
          this.$notify({
            title: "Comments Error",
            text: `An error has occurred: ${editResponse.resData}`,
            duration: 6000,
            type: "error",
          });
        } else if (editResponse.status === "Success") {
          this.$notify({
            title: "Comments",
            text: editResponse.resData,
            duration: 3000,
            type: "success",
          });
          // Set data and toggle off edit mode.
          this.commentData.commentText = commentText;
          this.toggleEditingMode(false);
        }
      }
    },
    deleteComment: async function () {
      if (
        window.confirm(
          "Are you sure you want to delete this comment? This action cannot be reversed."
        )
      ) {
        let deleteResponse = await this.$axios.$post(
          `${this.$config.serverUrl}/comments/delete/${this.commentData.id}`,
          {
            token: Cookies.get("auth"),
          }
        );
        if (deleteResponse.status === "Failure") {
          this.$notify({
            title: "Comments Error",
            text: `An error has occurred: ${deleteResponse.resData}`,
            duration: 6000,
            type: "error",
          });
        } else if (deleteResponse.status === "Success") {
          this.$notify({
            title: "Comments",
            text: deleteResponse.resData,
            duration: 3000,
            type: "success",
          });
          this.$emit("commentDeleted", this.commentIndex);
        }
      }
    },
    rateUp: async function () {
      let rateUpResponse = await this.$axios.$post(
        `${this.$config.serverUrl}/comments/rate/${this.commentData.id}`,
        {
          token: Cookies.get("auth"),
          rateUp: true,
        }
      );

      if (rateUpResponse.status === "Failure") {
        this.$notify({
          title: "Comments Error",
          text: `An error has occurred: ${rateUpResponse.resData}`,
          duration: 6000,
          type: "error",
        });
      } else if (rateUpResponse.status === "Success") {
        this.$notify({
          title: "Comments",
          text: rateUpResponse.resData,
          duration: 3000,
          type: "success",
        });
        this.commentData.rating = this.commentData.rating + 1;
      }
    },
    rateDown: async function () {
      let rateDownResponse = await this.$axios.$post(
        `${this.$config.serverUrl}/comments/rate/${this.commentData.id}`,
        {
          token: Cookies.get("auth"),
          rateUp: false,
        }
      );

      if (rateDownResponse.status === "Failure") {
        this.$notify({
          title: "Comments Error",
          text: `An error has occurred: ${rateDownResponse.resData}`,
          duration: 6000,
          type: "error",
        });
      } else if (rateDownResponse.status === "Success") {
        this.$notify({
          title: "Comments",
          text: rateDownResponse.resData,
          duration: 3000,
          type: "success",
        });
        this.commentData.rating = this.commentData.rating - 1;
      }
    },
  },
};
</script>
