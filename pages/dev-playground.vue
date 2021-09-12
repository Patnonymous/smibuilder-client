<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1>Dev Playground Page</h1>
        <input class="form-control" type="text" v-model="myInputMessage" />
        <button class="btn btn-success" @click="printInputToConsole">
          Print Message To Console
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <button class="btn btn-primary" @click="axiosGetTest">
          Do an Axios Get test to the server
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: function () {
    return {
      myInputMessage: "",
    };
  },
  mounted: function () {
    const TAG = "dev-playground - mounted(), ";
    console.log(TAG + "starting.");
    console.log(TAG + "$config.baseUrl env variable: ", this.$config.baseUrl);
    console.log(TAG + "process.env.BASE_URL: ", process.env.BASE_URL);
  },
  computed: {},
  methods: {
    printInputToConsole: function () {
      const TAG = "dev-playground - printInputToConsole(), ";
      console.log(TAG + "The input message is: ", this.myInputMessage);
    },
    axiosGetTest: function () {
      const TAG = "dev-playground - axiosGetTest(), ";
      console.log(TAG + "Starting.");
      this.$axios
        .$get("http://localhost:3030/users")
        .then((res) => {
          console.log(TAG + "get success. res: ", res);
        })
        .catch((error) => {
          console.log(TAG + "get failure.");
          console.error(error, error.stack);
        });
    },
  },
};
</script>