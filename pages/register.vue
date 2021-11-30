<template>
  <div class="container bg-secondary rounded">
    <div class="row justify-content-center">
      <div class="col-8">
        <h4>Register a New Account</h4>
        <form class="m-2 p-4" @submit.prevent="submitRegisterNewAccount">
          <div class="form-group">
            <label for="htmlUserInputEmail">Email address</label>
            <input
              type="email"
              class="form-control"
              id="htmlUserInputEmail"
              placeholder="example@site.com"
              v-model="userInputEmail"
              required
            />
            <small class="form-text"
              >We'll never share your email with anyone else. You will log in
              using the email.</small
            >
          </div>
          <div class="form-group">
            <label for="htmlUserInputUsername">Username</label>
            <input
              type="text"
              class="form-control"
              id="htmlUserInputUsername"
              placeholder="My Username 1234"
              v-model="userInputUsername"
              required
            />
            <small class="form-text"
              >Your username will be displayed to people.</small
            >
          </div>
          <div class="form-group">
            <label for="htmlUserInputPassword">Password</label>
            <input
              type="password"
              class="form-control"
              id="htmlUserInputPassword"
              placeholder="Password"
              v-model="userInputPassword"
              required
            />
          </div>
          <div class="form-group mb-0">
            <label for="htmlUserInputConfirmPassword">Confirm Password</label>
            <input
              type="password"
              class="form-control"
              id="htmlUserInputConfirmPassword"
              placeholder="Confirm Password"
              v-model="userInputConfirmPassword"
              required
            />
          </div>
          <p class="text-danger mt-1" v-if="errorMessage !== null">
            {{ errorMessage }}
          </p>

          <div class="row">
            <div class="col">
              <NuxtLink to="/login">Already have an account? Log In</NuxtLink>
              <button type="submit" class="btn btn-success m-2 float-right">
                Create New Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "register",
  layout: "public",
  components: {},
  data: function () {
    return {
      userInputEmail: "",
      userInputUsername: "",
      userInputPassword: "",
      userInputConfirmPassword: "",
      errorMessage: "",
    };
  },
  mounted: function () {},
  computed: {},
  methods: {
    /**
     * Registers a new account using the inputted info.
     * Does basic error checking then does does a POST to the register api.
     */
    submitRegisterNewAccount: async function () {
      let userEmail = this.userInputEmail.trim();
      let username = this.userInputUsername.trim();
      let userPassword = this.userInputPassword.trim();
      let confirmPassword = this.userInputConfirmPassword.trim();
      this.errorMessage = "";

      // Error checking.
      if (userEmail.length === 0) {
        this.errorMessage = "Trimmed email input was empty.";
      } else if (username.length === 0) {
        this.errorMessage = "Trimmed username input was empty.";
      } else if (userPassword.length === 0 || confirmPassword.length === 0) {
        this.errorMessage =
          "Trimmed password or confirmation password was empty.";
      } else if (userPassword !== confirmPassword) {
        this.errorMessage =
          "The passwords do not match. Please ensure you enter the same password in each field.";
      } else {
        this.$notify({
          title: "Registration",
          text: "Registration is disabled.",
          duration: 3000,
          type: "success",
        });
        // let registrationResponse = await this.$axios.$post(
        //   `${this.$config.serverUrl}/users/register`,
        //   {
        //     email: userEmail,
        //     username: username,
        //     password: userPassword,
        //   }
        // );
        // if (registrationResponse.status === "Failure") {
        //   this.errorMessage = registrationResponse.resData;
        //   this.$notify({
        //     title: "Registration Error",
        //     text: "An error has occurred.",
        //     duration: 6000,
        //     type: "error",
        //   });
        // } else if (registrationResponse.status === "Success") {
        //   this.resetForm();
        //   this.$notify({
        //     title: "Registration",
        //     text: "Registration was successful. You may now log in.",
        //     duration: 6000,
        //     type: "success",
        //   });
        //   this.$router.push({ path: "/login" });
        // }
      }
    },
    /**
     * Reset forms to their defaults.
     */
    resetForm: function () {
      this.userInputEmail = "";
      this.userInputUsername = "";
      this.userInputPassword = "";
      this.userInputConfirmPassword = "";
      this.errorMessage = "";
    },
  },
};
</script>
