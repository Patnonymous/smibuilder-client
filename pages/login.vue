<template>
  <div class="container bg-secondary rounded">
    <div class="row justify-content-center">
      <div class="col-8">
        <h4>You're currently a visitor. Log in to access more features.</h4>
        <form class="m-2 p-4" @submit.prevent="submitLogin">
          <div class="form-group">
            <label for="htmlUserInputEmail">Email address</label>
            <input
              type="email"
              class="form-control"
              id="htmlUserInputEmail"
              placeholder="example@site.com"
              v-model="userInputEmail"
            />
            <small id="emailHelp" class="form-text"
              >We'll never share your email with anyone else.</small
            >
          </div>
          <div class="form-group mb-4">
            <label for="htmlUserInputPassword">Password</label>
            <input
              type="password"
              class="form-control"
              id="htmlUserInputPassword"
              placeholder="Password"
              v-model="userInputPassword"
            />
          </div>

          <p class="text-danger mt-1" v-if="errorMessage !== null">
            {{ errorMessage }}
          </p>

          <div class="row">
            <div class="col">
              <NuxtLink to="/register">New user? Create Account</NuxtLink>
              <button type="submit" class="btn btn-success m-2 float-right">
                Log In
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
  name: "login",
  layout: "public",
  components: {},
  data: function () {
    return {
      userInputEmail: "",
      userInputPassword: "",
      errorMessage: "",
    };
  },
  mounted: function () {},
  computed: {},
  methods: {
    submitLogin: async function () {
      let userEmail = this.userInputEmail;
      let userPassword = this.userInputPassword;
      this.errorMessage = "";

      // Error checking.
      if (userEmail.length === 0) {
        this.errorMessage = "Email input was empty.";
      } else if (userPassword.length === 0) {
        this.errorMessage = "Password input was empty.";
      } else {
        let loginResponse = await this.$axios.$post(
          `${this.$config.serverUrl}/users/login`,
          {
            email: userEmail,
            password: userPassword,
          }
        );

        if (loginResponse.status === "Failure") {
          this.errorMessage = loginResponse.resData;
          this.$notify({
            title: "Login Error",
            text: loginResponse.resData,
            duration: 6000,
            type: "error",
          });
        } else if (loginResponse.status === "Success") {
          // Notify the user, commit their data to the store, then redirect.
          this.$notify({
            title: "Login",
            text: "You are now logged in and authorized.",
            duration: 3000,
            type: "success",
          });
          localStorage.setItem("auth", loginResponse.resData.token);
          this.$store.commit("user/setUser", loginResponse.resData.userObject);
          this.$router.push({ path: "/builds/search" });
        }
      }
    },
  },
};
</script>
