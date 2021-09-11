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
  mounted: function () {},
  computed: {},
  methods: {
    printInputToConsole: function () {
      const TAG = "dev-playground - printInputToConsole(), ";
      console.log(TAG + "The input message is: ", this.myInputMessage);
    },
  },
};
</script>