<template>
  <div class="card" style="width: 9rem">
    <img class="card-img-top" :src="cardUrl" alt="Card image cap" />
    <div class="card-body m-0 p-0">
      <h5 class="card-title text-center m-0 pt-2 pb-2" style="font-size: 1em">
        {{ godName }}
      </h5>
    </div>
  </div>
</template>

<script>
/**
 * @author Patrick W.
 * @description A larger god card that will hold the full card art.
 */
export default {
  name: "GodCardLarge",
  components: {},
  props: {
    id: {
      type: Number,
      required: true,
    },
    godName: {
      type: String,
      required: true,
    },
    cardUrl: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {};
  },
  mounted: async function () {},
  computed: {},
  methods: {},
};
</script>

