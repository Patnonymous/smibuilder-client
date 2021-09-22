<template>
  <div class="container bg-primary rounded">
    <div class="row justify-content-center">
      <div class="col-auto">
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
          <div class="form-group">
            <label for="htmlUserInputPassword">Password</label>
            <input
              type="password"
              class="form-control"
              id="htmlUserInputPassword"
              placeholder="Password"
              v-model="userInputPassword"
            />
          </div>
          <button type="submit" class="btn btn-success m-2 float-right">
            Log In
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  components: {},
  data: function () {
    return {
      userInputEmail: "",
      userInputPassword: "",
    };
  },
  mounted: function () {},
  computed: {},
  methods: {
    submitLogin: function () {
      const TAG = "login - submitLogin(), ";
      console.log("\n" + TAG + "userInputEmail: ", this.userInputEmail);
      console.log(TAG + "userInputPassword: " + this.userInputPassword);
    },
  },
};
</script>
