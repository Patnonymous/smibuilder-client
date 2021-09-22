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
      </ul>
      <div class="form-inline my-2 my-lg-0">
        <button
          class="btn btn-outline-primary ml-4"
          @click="changePage('/login')"
        >
          Log In
        </button>
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
      const TAG = "NavBar - changePage(), ";
      console.log(TAG + "The current route is: ");
      console.log(this.$route);
      console.log(TAG + "navigating to pageRoute: " + pageRoute);
      this.$router.push({ path: pageRoute });
    },
  },
};
</script>