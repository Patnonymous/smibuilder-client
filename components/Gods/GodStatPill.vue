<template>
  <div v-if="statNumber !== 0" class="row border rounded mt-1">
    <div class="col">
      <span class="float-left">{{ statLabel }}</span>
      <span class="float-right">{{ statOutput }}</span>
    </div>
  </div>
</template>

<script>
/**
 * @author Patrick W.
 * @description An input to display a statistic.
 */
const { round } = require("mathjs");
export default {
  name: "GodStatPill",
  components: {},
  props: {
    /**
     * The stats number at level 1.
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

