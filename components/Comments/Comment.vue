<template>
  <div class="row mt-2 mb-2 border border-primary rounded">
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
              <button type="button" class="btn btn-outline-success w-100">
                Rate Up
              </button>
            </div>
          </div>
          <div class="row mt-1 mb-1">
            <div class="col">
              <button type="button" class="btn btn-outline-danger w-100">
                Rate Down
              </button>
            </div>
          </div>
        </div>
        <div class="col">
          <h5>'{{ commentData.commentText }}'</h5>
        </div>
      </div>

      <!-- Row holds controls for comment owners. -->
      <div class="row"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  components: {},
  props: {
    commentData: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    return {};
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
    rateUp: function () {},
    rateDown: function () {},
  },
};
</script>
