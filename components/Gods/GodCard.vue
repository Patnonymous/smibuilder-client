<template>
  <div class="card god-card-style" style="width: 7rem">
    <img class="card-img-top" :src="iconUrl" alt="Card image cap" />
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
 * @description A small div with the class card, used to display the characters icon and name.
 * This is used as a button to do things, to see it in action look at the selector.vue page.
 */
export default {
  name: "GodCard",
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
    iconUrl: {
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

<style scoped>
.god-card-style {
  cursor: pointer;
  transition: transform 0.2s;
}
.god-card-style:hover {
  transform: scale(1.2);
}
</style>
