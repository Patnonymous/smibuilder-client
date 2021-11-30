<template>
  <div class="col">
    <!-- Row for new comment. -->
    <div class="row m-2">
      <div class="col">
        <form @submit.prevent="submitNewComment">
          <div class="form-group">
            <label for="textAreaComment"><h3>Comments</h3></label>
            <textarea
              v-model="userInputComment"
              class="form-control"
              id="textAreaComment"
              rows="3"
              placeholder="Your comment here..."
              maxlength="255"
            ></textarea>
            <small id="smallCommentHelp" class="form-text"
              >Remember to be nice.</small
            >
          </div>
          <div class="form-group">
            <p class="text-danger" v-if="errorMessage !== null">
              {{ errorMessage }}
            </p>
          </div>
          <button type="submit" class="btn btn-primary float-right">
            Submit New Comment
          </button>
        </form>
      </div>
    </div>

    <div class="row p-1 m-2 mb-1 mt-4 bg-light rounded">
      <div class="col-3">
        <span class="text-dark">Sort: </span>
        <b-dropdown
          id="dropdown-1"
          :text="currentSortType"
          variant="primary"
          class="ml-4"
        >
          <b-dropdown-item @click="changeSort('Date Added')"
            >Date Added</b-dropdown-item
          >
          <b-dropdown-item @click="changeSort('Rating')"
            >Rating</b-dropdown-item
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

    <!-- Row for comments display section. -->
    <div
      v-if="commentsReady"
      class="row justify-content-center row m-2 comment-list-height"
    >
      <div class="col mh-100 overflow-auto border border-primary rounded thick">
        <Comment
          @commentDeleted="removeCommentFromArray"
          class="bg-light rounded text-dark"
          v-for="(comment, index) in filteredComments"
          :key="comment.id"
          :commentIndex="index"
          :commentData="comment"
        />
      </div>
    </div>
  </div>
</template>

<script>
// Imports.
import Comment from "./Comment.vue";
import Cookies from "js-cookie";

export default {
  name: "CommentsWidget",
  components: {
    Comment,
  },
  props: {
    buildId: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      arrayComments: [],
      commentsReady: false,
      userInputComment: "",
      errorMessage: null,
      // Sorting vars.
      currentSortType: "Date Added",
      sortAscending: false,
    };
  },
  mounted: async function () {
    this.getAllComments();
  },
  computed: {
    filteredComments: function () {
      let filteredComments = [];
      if (this.currentSortType === "Date Added") {
        filteredComments = this.arrayComments.sort((a, b) => {
          if (a.createdOn < b.createdOn) {
            return 1;
          } else if (a.createdOn > b.createdOn) {
            return -1;
          } else {
            return 0;
          }
        });
      } else if (this.currentSortType === "Rating") {
        filteredComments = this.arrayComments.sort((a, b) => {
          if (a.rating < b.rating) {
            return 1;
          } else if (a.rating > b.rating) {
            return -1;
          } else {
            return 0;
          }
        });
      }

      if (this.sortAscending) {
        filteredComments.reverse();
      }
      return filteredComments;
    },
  },
  methods: {
    getAllComments: async function () {
      this.arrayComments.length = 0;
      this.commentsReady = false;

      let commentsResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/comments/${this.buildId}`
      );
      if (commentsResponse.status === "Failure") {
        this.$notify({
          title: "Comments Error",
          text: `An error has occurred: ${commentsResponse.resData}`,
          duration: 6000,
          type: "error",
        });
      } else if (commentsResponse.status === "Success") {
        this.arrayComments = commentsResponse.resData;
        this.commentsReady = true;
        console.log(this.arrayComments);
      }
    },
    submitNewComment: async function () {
      this.errorMessage = null;
      // Trim.
      let commentText = this.userInputComment.trim();

      // Error checking.
      if (commentText.length < 1) {
        this.errorMessage = "Please enter your comment.";
      } else if (commentText.length > 254) {
        this.errorMessage = "Comment length exceeds limit (254)";
      }

      // Continue if no error.
      if (!this.errorMessage) {
        let addNewCommentResponse = await this.$axios.$post(
          `${this.$config.serverUrl}/comments/${this.buildId}`,
          {
            token: Cookies.get("auth"),
            userId: this.$store.state.user.currentUser.userId,
            commentText: commentText,
          }
        );

        if (addNewCommentResponse.status === "Failure") {
          this.$notify({
            title: "Comments Error",
            text: `An error has occurred: ${addNewCommentResponse.resData}`,
            duration: 6000,
            type: "error",
          });
        } else if (addNewCommentResponse.status === "Success") {
          this.userInputComment = "";
          this.$notify({
            title: "Comments",
            text: addNewCommentResponse.resData,
            duration: 3000,
            type: "success",
          });
          this.getAllComments();
        }
      }
    },
    removeCommentFromArray: function (index) {
      this.arrayComments.splice(index, 1);
    },
    changeSort: function (sortType) {
      this.currentSortType = sortType;
    },
  },
};
</script>

<style scoped>
.comment-list-height {
  height: 80vh;
}
.thick {
  border-width: 5px !important;
}
</style>
