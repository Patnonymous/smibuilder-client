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

    <!-- Row for comments display section. -->
    <div
      v-if="commentsReady"
      class="row justify-content-center row m-2 comment-list-height"
    >
      <div class="col-8 mh-100 overflow-auto">
        <Comment
          class="bg-light rounded text-dark"
          v-for="comment in arrayComments"
          :key="comment.id"
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
    };
  },
  mounted: async function () {
    this.getAllComments();
  },
  computed: {},
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
            token: localStorage.getItem("auth"),
            userId: this.$store.state.user.currentUser.userId,
            commentText: commentText,
          }
        );

        console.log(addNewCommentResponse);

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
  },
};
</script>

<style scoped>
.comment-list-height {
  height: 80vh;
}
</style>
