<template>
  <div>
    <div class="col p-1 bg-dark rounded text-center">
      <div class="card" style="width: 3.5rem; height: 3.5rem">
        <img
          v-b-tooltip.hover
          :title="abilityData.Summary"
          class="card-img-top"
          :src="abilityData.URL"
          alt="Ability Icon"
        />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @description Display an ability according to data. Displays the ability icon and name on hover.
 * NOTE: No functionality for this is specified in project docs other than the figma images. This may be updated later
 * to display some more data like ability descriptions and mana costs etc.
 */
export default {
  name: "GodAbilityPill",
  components: {},
  props: {
    abilityData: {
      type: Object,
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
