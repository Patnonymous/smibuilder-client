<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-auto">
        <div class="row">
          <GodTagPill
            class="m-2"
            v-for="item in godTags"
            :tagLabel="item"
            :key="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports
import GodTagPill from "./GodTagPill.vue";

/**
 * @description A row-col template that will display GodTagPill's according to the
 * passed in godObject's info.
 */
export default {
  name: "GodTagsMain",
  components: {
    GodTagPill,
  },
  props: {
    godObject: {
      type: Object,
      required: true,
    },
    godDamageType: {
      type: String,
      required: true,
    },
    godBasicAttackType: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      godTags: [],
    };
  },
  mounted: async function () {
    // First tag is pantheon
    this.godTags.push(this.godObject.Pantheon);
    // Second tag is role
    this.godTags.push(this.godObject.Roles);
    // Third is basic attack type
    this.godTags.push(this.godBasicAttackType);
    // Fourth is damage type
    this.godTags.push(this.godDamageType);
  },
  computed: {},
  methods: {},
};
</script>
