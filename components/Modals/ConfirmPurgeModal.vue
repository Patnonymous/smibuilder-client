<template>
  <modal :name="name" :reset="true" height="auto">
    <div class="m-2">
      <form @submit.prevent="submitPurge">
        <h5>This will delete your account and data related to it.</h5>
        <h3>This cannot be reversed.</h3>
        <div class="form-group">
          <label for="inputBuildTitle"
            >Please enter your password to continue.</label
          >
          <input
            required
            type="password"
            class="form-control"
            id="inputPassword"
            v-model="passwordEntry"
          />
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
        >
          Confirm Purge
        </button>
      </form>
    </div>
  </modal>
</template>

<script>
export default {
  name: "ConfirmPurgeModal",
  components: {},
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      passwordEntry: "",
      errorMessage: null,
    };
  },
  mounted: function () {},
  computed: {},
  methods: {
    submitPurge: async function () {
      this.errorMessage = null;
      let password = this.passwordEntry;

      // Client side error checks.
      if (password.length === 0) {
        this.errorMessage = "Please enter your password.";
      }

      // Continue if no error.
      if (this.errorMessage === null) {
        this.$notify({
          title: "Purge",
          text: "Purge is under construction. Please wait warmly.",
          duration: 3000,
          type: "success",
        });
        // let purgeResponse = await this.$axios.$post(
        //   `${this.$config.serverUrl}/users/purge`,
        //   {
        //     token: localStorage.getItem("auth"),
        //     userId: this.$store.state.user.currentUser.userId,
        //     password: password,
        //   }
        // );

        // if (purgeResponse.status === "Failure") {
        //   this.$notify({
        //     title: "Purge Error.",
        //     text: `An error has occurred: ${purgeResponse.resData}`,
        //     duration: 6000,
        //     type: "error",
        //   });
        // } else if (purgeResponse.status === "Success") {
        //   this.$notify({
        //     title: "Purge",
        //     text: purgeResponse.resData,
        //     duration: 3000,
        //     type: "success",
        //   });
        // }
      }
    },
  },
};
</script>
