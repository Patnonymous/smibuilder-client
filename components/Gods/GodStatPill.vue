<template>
  <div v-if="statNumber !== 0" class="row border rounded mt-1">
    <div class="col">
      <span class="float-left">{{ statLabel }}</span>
      <span class="float-right">{{ statOutput }}</span>
    </div>
  </div>
</template>

<script>
// Imports
const { round } = require("mathjs");

/**
 * @author Patrick W.
 * @description A row-col template that will display a stat.
 * Has multiple props to configure how the stat will display and work.
 */
export default {
  name: "GodStatPill",
  components: {},
  props: {
    /**
     * The stats number at base level.
     * Note that stats that scale will ALWAYS start out at statBase + (scalingPerlevel * 1)
     * because you can't have a scaling stat start at level zero.
     */
    statBase: {
      type: Number,
      required: true,
    },
    statLabel: {
      type: String,
      required: true,
    },
    /**
     * Enable level scaling for the stat.
     */
    scalesWithLevel: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * The scaling per leve. Stat base + (level * scalingPerLevel)
     */
    scalingPerLevel: {
      type: Number,
      required: false,
      default: 0,
    },
    currentLevel: {
      type: Number,
      required: false,
      default: 1,
    },
    /**
     * Apply special rounding to the stat value.
     * Ex. Attack speed rounds to 2 decimals.
     */
    roundingDecimals: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data: function () {
    return {
      statNumber: 0,
    };
  },
  mounted: async function () {
    this.statNumber = this.statBase;
  },
  computed: {
    statOutput: function () {
      if (this.scalesWithLevel === true) {
        return round(
          this.statNumber + this.scalingPerLevel * this.currentLevel,
          this.roundingDecimals
        );
      } else {
        return this.statNumber;
      }
    },
  },
  methods: {},
};
</script>

