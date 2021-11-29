<template>
  <modal :name="name" :reset="true" height="auto">
    <div class="m-2">
      <form @submit.prevent="submitChangePassword">
        <div class="form-group">
          <label for="inputBuildTitle">Current Password</label>
          <input
            required
            type="password"
            class="form-control"
            id="inputCurrentPassword"
            v-model="currentPassword"
          />
        </div>
        <div class="form-group">
          <label for="inputBuildTitle">New Password</label>
          <input
            required
            type="password"
            class="form-control"
            id="inputNewPassword"
            v-model="newPassword"
          />
        </div>
        <div class="form-group">
          <label for="inputBuildTitle">Confirm New Password</label>
          <input
            required
            type="password"
            class="form-control"
            id="inputConfirmNewPassword"
            v-model="confirmNewPassword"
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
          Change Password
        </button>
      </form>
    </div>
  </modal>
</template>

<script>
export default {
  name: "ChangePasswordModal",
  components: {},
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      errorMessage: null,
    };
  },
  mounted: function () {},
  computed: {},
  methods: {
    submitChangePassword: async function () {
      const TAG = "\nChangePasswordModal - submitChangePassword(), ";
      this.errorMessage = null;
      // Trim.
      let trimmedCurrentPassword = this.currentPassword.trim();
      let trimmedNewPassword = this.newPassword.trim();
      let trimmedConfirmNewPassword = this.confirmNewPassword.trim();

      // DEBUG.
      console.log(TAG + "Outputting inputs.");
      console.log("trimmedCurrentPassword: ", trimmedCurrentPassword);
      console.log("trimmedNewPassword: ", trimmedNewPassword);
      console.log("trimmedConfirmNewPassword: ", trimmedConfirmNewPassword);

      // Do some client side error checking.
      if (trimmedCurrentPassword.length === 0) {
        this.errorMessage = "Please enter your current password.";
      } else if (trimmedNewPassword.length === 0) {
        this.errorMessage = "Please enter your new password.";
      } else if (trimmedConfirmNewPassword.length === 0) {
        this.errorMessage = "Please confirm your new password.";
      } else if (trimmedNewPassword !== trimmedConfirmNewPassword) {
        this.errorMessage =
          "New password and confirmation do not match. Please double check your inputs.";
      }

      // Continue if no error.
      if (this.errorMessage === null) {
        let changePasswordResponse = await this.$axios.$post(
          `${this.$config.serverUrl}/users/change/password`,
          {
            token: localStorage.getItem("auth"),
            userId: this.$store.state.user.currentUser.userId,
            currentPassword: trimmedCurrentPassword,
            newPassword: trimmedNewPassword,
          }
        );
        if (changePasswordResponse.status === "Failure") {
          this.$notify({
            title: "Change Password Error.",
            text: `An error has occurred: ${changePasswordResponse.resData}`,
            duration: 6000,
            type: "error",
          });
        } else if (changePasswordResponse.status === "Success") {
          this.$notify({
            title: "Change Password",
            text: changePasswordResponse.resData,
            duration: 3000,
            type: "success",
          });
          this.$emit("passwordChanged");
        }
      }
    },
  },
};
</script>

