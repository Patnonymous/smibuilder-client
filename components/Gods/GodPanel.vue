<template>
  <div>
    <!-- First inner row will hold the card image and basic stats -->
    <div class="row justify-content-center">
      <div class="col-auto">
        <GodCardLarge
          :id="godObject.id"
          :godName="godObject.Name"
          :cardUrl="godObject.godCard_URL"
        />
      </div>

      <div class="col">
        <div class="row">
          <div class="col"><h3 class="align-middle">Level</h3></div>
          <div class="col">
            <input
              class="form-control"
              type="number"
              min="1"
              max="20"
              v-model="currentLevel"
            />
          </div>
        </div>

        <GodStatPill
          statLabel="Health"
          :statBase="godObject.Health"
          :scalesWithLevel="true"
          :scalingPerLevel="godObject.HealthPerLevel"
          :currentLevel="currentLevelToInt"
        />
        <GodStatPill
          statLabel="Mana"
          :statBase="godObject.Mana"
          :scalesWithLevel="true"
          :scalingPerLevel="godObject.ManaPerLevel"
          :currentLevel="currentLevelToInt"
        />

        <GodStatPill
          v-if="godDamageType === 'Physical'"
          statLabel="Physical Power"
          :statBase="godObject.PhysicalPower"
          :scalesWithLevel="true"
          :scalingPerLevel="godObject.PhysicalPowerPerLevel"
          :currentLevel="currentLevelToInt"
        />
        <GodStatPill
          v-else
          statLabel="Magical Power"
          :statBase="godObject.MagicalPower"
          :scalesWithLevel="true"
          :scalingPerLevel="godObject.MagicalPowerPerLevel"
          :currentLevel="currentLevelToInt"
        />

        <GodStatPill
          statLabel="Physical Protection"
          :statBase="godObject.PhysicalProtection"
          :scalesWithLevel="true"
          :scalingPerLevel="godObject.PhysicalProtectionPerLevel"
          :currentLevel="currentLevelToInt"
        />
        <GodStatPill
          statLabel="Magical Protection"
          :statBase="godObject.MagicProtection"
          :scalesWithLevel="true"
          :scalingPerLevel="godObject.MagicProtectionPerLevel"
          :currentLevel="currentLevelToInt"
        />
      </div>
    </div>

    <!-- Second inner row will hold the advanced stats -->
    <div class="row justify-content-center">
      <div class="col">
        <div class="row">
          <div class="col text-center">
            <h2>Advanced Stats</h2>
          </div>
        </div>

        <GodStatPill
          statLabel="Attack Speed"
          :statBase="godObject.AttackSpeed"
          :scalesWithLevel="true"
          :scalingPerLevel="godObject.AttackSpeedPerLevel"
          :currentLevel="currentLevelToInt"
          :roundingDecimals="2"
        />
        <GodStatPill
          statLabel="Attack Speed Per Level"
          :statBase="godObject.AttackSpeedPerLevel"
        />
        <GodStatPill
          statLabel="Health Per Level"
          :statBase="godObject.HealthPerLevel"
        />
        <GodStatPill
          statLabel="Mana Per Level"
          :statBase="godObject.ManaPerLevel"
        />
        <GodStatPill
          statLabel="HP5"
          :statBase="godObject.HealthPerFive"
          :scalesWithLevel="true"
          :scalingPerLevel="godObject.HP5PerLevel"
          :currentLevel="currentLevelToInt"
          :roundingDecimals="2"
        />
        <GodStatPill
          statLabel="HP5 Per Level"
          :statBase="godObject.HP5PerLevel"
        />
        <GodStatPill
          statLabel="MP5"
          :statBase="godObject.ManaPerFive"
          :scalesWithLevel="true"
          :scalingPerLevel="godObject.MP5PerLevel"
          :currentLevel="currentLevelToInt"
          :roundingDecimals="2"
        />
        <GodStatPill
          statLabel="MP5 Per Level"
          :statBase="godObject.MP5PerLevel"
        />
        <GodStatPill statLabel="Movement Speed" :statBase="godObject.Speed" />
      </div>
    </div>
  </div>
</template>

<script>
// Imports.
import GodCardLarge from "./GodCardLarge.vue";
import GodStatPill from "./GodStatPill.vue";

export default {
  name: "GodPanel",
  components: {
    GodCardLarge,
    GodStatPill,
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
  },
  data: function () {
    return {
      currentLevel: 1,
    };
  },
  mounted: async function () {},
  computed: {
    /**
     * @description Computed property to parse the level string to an Int.
     */
    currentLevelToInt: function () {
      return parseInt(this.currentLevel);
    },
  },
  methods: {},
};
</script>

