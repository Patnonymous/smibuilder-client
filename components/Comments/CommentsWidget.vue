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
              :disabled="!$store.state.user.authorized"
            ></textarea>
            <small
              v-if="$store.state.user.authorized"
              id="smallCommentHelp"
              class="form-text"
              >Remember to be nice.</small
            >
            <small v-else id="smallCommentHelp" class="form-text"
              >Have something to say? Login to comment.</small
            >
          </div>
          <div class="form-group">
            <p class="text-danger" v-if="errorMessage !== null">
              {{ errorMessage }}
            </p>
          </div>
          <button
            type="submit"
            class="btn btn-primary float-right"
            :disabled="!$store.state.user.authorized"
          >
            Submit New Comment
          </button>
        </form>
      </div>
    </div>

    <!-- Row for comment controls. -->
    <div class="row p-1 m-2 mb-1 mt-4 bg-light rounded">
      <!-- Sorting controls. -->
      <div class="col-3">
        <span class="text-dark">Sort: </span>
        <b-dropdown
          id="dropdown-1"
          :text="currentSortType"
          variant="primary"
          class="ml-4"
          :disabled="totalNumberOfPages === 0"
        >
          <b-dropdown-item @click="changeSort('Date')"
            >Date Added</b-dropdown-item
          >
          <b-dropdown-item @click="changeSort('Rating')"
            >Rating</b-dropdown-item
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

    <!-- Row for comments display section. -->
    <div
      v-if="commentsReady"
      class="row justify-content-center row m-2 comment-list-height"
    >
      <div class="col mh-100 overflow-auto border border-primary rounded thick">
        <Comment
          @commentDeleted="removeCommentFromArray"
          class="bg-light rounded text-dark"
          v-for="(comment, index) in arrayComments"
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
      currentSortType: "Date",
      sortAscending: false,
      // Pagination vars.
      totalNumberOfPages: 0,
      currentPage: 0,
    };
  },
  mounted: async function () {
    let areThereComments = await this.getCommentsPaginationInfo();
    if (areThereComments) {
      this.currentPage = 1;
      this.getCommentsPaginated();
    }
  },
  computed: {},
  methods: {
    /**
     * @description Get the total number of pages to use for this comments section.
     * Returns true if comments should be updated and loaded.
     * Returns false if no comments
     */
    getCommentsPaginationInfo: async function () {
      let paginationInfoResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/comments/pagination-info/${this.buildId}`
      );

      if (paginationInfoResponse.status === "Failure") {
        this.$notify({
          title: "Pagination Error",
          text: `An error has occurred: ${paginationInfoResponse.resData}`,
          duration: 6000,
          type: "error",
        });
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
    getCommentsPaginated: async function () {
      let paginatedCommentsResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/comments/${this.buildId}/${this.currentPage}/${this.currentSortType}/${this.sortAscending}`
      );

      if (paginatedCommentsResponse.status === "Failure") {
        this.$notify({
          title: "Comments Error",
          text: `An error has occurred: ${paginatedCommentsResponse.resData}`,
          duration: 6000,
          type: "error",
        });
      } else if (paginatedCommentsResponse.status === "Success") {
        this.arrayComments = paginatedCommentsResponse.resData;
        this.commentsReady = true;
      }
    },
    /**
     * @description Submit a new comment.
     */
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
            token: this.$cookies.get("auth"),
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
          // Get new pagination info and set comments.
          let areThereComments = await this.getCommentsPaginationInfo();
          if (areThereComments) {
            this.currentPage = 1;
            this.getCommentsPaginated();
          } else {
            this.currentPage = 0;
            this.arrayComments.length = 0;
          }
        }
      }
    },
    /**
     * @description Called whena  comment is removed.
     * Updates data accordingly.
     */
    removeCommentFromArray: async function (index) {
      let areThereComments = await this.getCommentsPaginationInfo();
      if (areThereComments) {
        this.currentPage = 1;
        this.getCommentsPaginated();
      } else {
        this.currentPage = 0;
        this.arrayComments.length = 0;
      }
    },
    changeSort: function (sortType) {
      this.currentSortType = sortType;
      this.currentPage = 1;
      this.getCommentsPaginated();
    },
    changeAscending: function (ascendBool) {
      this.sortAscending = ascendBool;
      this.currentPage = 1;
      this.getCommentsPaginated();
    },
    /**
     * @description Sets currentPage to 1.
     * Does nothing if totalNumberOfPages is 0 (that means no comments).
     */
    goToFirstPage: function () {
      if (this.totalNumberOfPages > 0) {
        this.currentPage = 1;
        this.getCommentsPaginated();
      }
    },
    /**
     * @description Decrements currentPage by 1 if currentPage is greater than 1.
     */
    decrementPage: function () {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.getCommentsPaginated();
      }
    },
    /**
     * @description Increments currentPage by 1 if currentPage is les than totalNumberOfPages.
     */
    incrementPage: function () {
      if (this.currentPage < this.totalNumberOfPages) {
        this.currentPage++;
        this.getCommentsPaginated();
      }
    },
    /**
     * @description Sets currentPage to 1.
     * Does nothing if totalNumberOfPages is 0 (that means no comments).
     */
    goToLastPage: function () {
      if (this.totalNumberOfPages > 0) {
        this.currentPage = this.totalNumberOfPages;
        this.getCommentsPaginated();
      }
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
