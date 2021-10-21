<template>
  <div>
    <!-- Shows if validGod is true -->
    <div v-if="validGod !== false" class="container-fluid">
      <!-- Greater outer row will hold everything -->
      <div class="row">
        <!-- Left side col will hold the god, their stats, level info etc. -->
        <div class="col-3 border border-primary">
          <!-- First inner row will hold the card image and basic stats -->
          <div class="row justify-content-center border border-danger">
            <div class="col-auto border border-primary">
              <GodCardLarge
                :id="godObject.id"
                :godName="godObject.Name"
                :cardUrl="godObject.godCard_URL"
              />
            </div>

            <div class="col">
              <div class="row border">
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
          <div class="row justify-content-center border border-warning">
            <div class="col">
              <div class="row">
                <div class="col border border-danger text-center">
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
              <GodStatPill
                statLabel="Movement Speed"
                :statBase="godObject.Speed"
              />
            </div>
          </div>
        </div>

        <!-- Right side col will hold the tags, abilities, item info, and publish buttons -->
        <div class="col border border-warning"></div>
      </div>
    </div>

    <!-- Error container shows if validGod is false -->
    <div v-else class="container">
      <div class="row">
        <div class="col">
          <h2>
            An error occurred. God with the ID {{ godId }} may not exist. Check
            your query.
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GodCardLarge from "../../components/Gods/GodCardLarge.vue";
import GodStatPill from "../../components/Gods/GodStatPill.vue";
export default {
  head: {
    title: "Create a Build",
  },
  layout: "public",
  components: {
    GodCardLarge,
    GodStatPill,
  },
  async asyncData({ params }) {
    const godId = params.godId;
    return { godId };
  },
  data: function () {
    return {
      /** True when the god data is loaded. */
      validGod: false,
      godObject: {},
      currentLevel: 1,
      /** Magical or Physical */
      godDamageType: null,
      /** Melee or Ranged */
      godBasicAttackType: null,
    };
  },
  /**
   * @description Async mounted function will attempt to get the god from the server.
   */
  mounted: async function () {
    const TAG = "\n_god-id.vue - mounted(), ";
    console.log(TAG + "Creating for god with id: ", this.godId);

    let loader = this.$loading.show();

    try {
      let getGodResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/gods/${this.godId}`
      );
      console.log("getGodResponse: ", getGodResponse);

      if (getGodResponse.status === "Failure") {
        this.$notify({
          title: "Create Error",
          text: `An error has occurred: ${getGodResponse.resData}`,
          duration: 6000,
          type: "error",
        });
        loader.hide();
      } else if (getGodResponse.status === "Success") {
        this.godObject = getGodResponse.resData;

        // Successfully got the data. Now set damage type and attack type for easy access.
        const splitted = this.godObject.Type.replace(/\s/g, "").split(",");

        for (const splittedIndex in splitted) {
          if (splitted[splittedIndex] === "Ranged") {
            this.godBasicAttackType = "Ranged";
          } else if (splitted[splittedIndex] === "Melee") {
            this.godBasicAttackType = "Melee";
          } else if (splitted[splittedIndex] === "Physical") {
            this.godDamageType = "Physical";
          } else if (splitted[splittedIndex] === "Magical") {
            this.godDamageType = "Magical";
          }
        }

        this.validGod = true;
        console.log("godObject: ");
        console.dir(this.godObject);
        loader.hide();
      }
    } catch (error) {
      console.log("ERROR: ");
      console.error(error);
      this.$notify({
        title: "Create Error",
        text: `An error has occurred: ${error.message}`,
        duration: 6000,
        type: "error",
      });
    }
  },
  computed: {
    currentLevelToInt: function () {
      return parseInt(this.currentLevel);
    },
  },
  methods: {},
};
</script>
