<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <button
            class="btn btn-outline-primary ml-4"
            @click="changePage('/create/selector')"
          >
            Create
          </button>
        </li>
        <li class="nav-item">
          <button
            class="btn btn-outline-primary ml-4"
            @click="changePage('/builds/search')"
          >
            Builds
          </button>
        </li>
        <li v-if="$store.state.user.authorized === true" class="nav-item">
          <button
            class="btn btn-outline-primary ml-4"
            @click="changePage('/favourites')"
          >
            Favourites
          </button>
        </li>
        <li
          v-if="
            $store.state.user.authorized === true &&
            $store.state.user.currentUser.userType === 'Admin'
          "
          class="nav-item"
        >
          <button class="btn btn-outline-primary ml-4">Admin</button>
        </li>
      </ul>
      <div
        v-if="$store.state.user.authorized === false"
        class="form-inline my-2 my-lg-0"
      >
        <button
          class="btn btn-outline-primary ml-4"
          @click="changePage('/login')"
        >
          Log In
        </button>
      </div>
      <div v-else>
        <b-dropdown
          id="dropdown-1"
          :text="$store.state.user.currentUser.userName"
          variant="outline-primary"
          class="ml-4"
        >
          <b-dropdown-item>My Account</b-dropdown-item>
          <b-dropdown-item @click="logout">Logout</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item active>Active action</b-dropdown-item>
          <b-dropdown-item disabled>Disabled action</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  components: {},
  data: function () {
    return {};
  },
  mounted: function () {},
  computed: {},
  methods: {
    changePage: function (pageRoute) {
      this.$router.push({ path: pageRoute });
    },
    logout: function () {
      localStorage.removeItem("auth");
      this.$store.commit("user/logOut");
      this.$notify({
        title: "Log out.",
        text: "You are now logged out.",
        duration: 3000,
        type: "success",
      });
      this.$router.push({ path: "/builds/search" });
    },
  },
};
</script>