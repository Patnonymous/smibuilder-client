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
      <div class="col">
        <input class="form-control" type="number" v-model="myInputNumber" />
        <button class="btn btn-secondary" @click="axiosGetMultiplyByThree">
          Axios Get multiply number by 3
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
      myInputNumber: 0,
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
    /**
     * @description Do a test get to Axios example /uses/ route.
     * Returns a simple string. A good test to see if it works.
     */
    axiosGetTest: function () {
      const TAG = "dev-playground - axiosGetTest(), ";
      console.log(TAG + "Starting.");
      this.$axios
        .$get(`${this.$config.serverUrl}/users`)
        .then((res) => {
          console.log(TAG + "get success. res: ", res);
        })
        .catch((error) => {
          console.log(TAG + "get failure.");
          console.error(error, error.stack);
        });
    },
    axiosGetMultiplyByThree: function () {
      const TAG = "dev-playground - axiosGetMultiplyByThree(), ";
      console.log(
        TAG + "will multiple the following number by 3: ",
        this.myInputNumber
      );
      this.$axios
        .$post(`${this.$config.serverUrl}/pw-testing/multiply-by-three`, {
          numberToMultiply: this.myInputNumber,
        })
        .then((res) => {
          console.log(
            TAG + "/pw-testing/multiply-by-three get success. res: ",
            res
          );
        })
        .catch((error) => {
          console.log(TAG + "/pw-testing/multiply-by-three get failure.");
          console.error(error, error.stack);
        });
    },
  },
};
</script>