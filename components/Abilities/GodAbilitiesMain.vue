<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-auto">
        <div class="row">
          <GodAbilityPill class="m-2" :abilityData="ability5" />
          <GodAbilityPill class="m-2" :abilityData="ability1" />
          <GodAbilityPill class="m-2" :abilityData="ability2" />
          <GodAbilityPill class="m-2" :abilityData="ability3" />
          <GodAbilityPill class="m-2" :abilityData="ability4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports
import GodAbilityPill from "./GodAbilityPill.vue";

/**
 * @description A row-col template that will display ability icons.
 */
export default {
  name: "GodAbilitiesMain",
  components: {
    GodAbilityPill,
  },
  props: {
    ability1: {
      type: Object,
      required: true,
    },
    ability2: {
      type: Object,
      required: true,
    },
    ability3: {
      type: Object,
      required: true,
    },
    ability4: {
      type: Object,
      required: true,
    },
    ability5: {
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
