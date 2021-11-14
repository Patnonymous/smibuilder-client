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

        <!-- Right side col will hold the tags, abilities, items, and publish buttons -->
        <div class="col ml-2 border border-warning">
          <!-- This row will hold tags -->
          <div class="row bg-secondary text-white justify-content-center">
            <div class="col">
              <div class="row justify-content-center text-center">
                <div class="col">
                  <h1>Tags</h1>
                </div>
              </div>
              <GodTagsMain
                :godObject="godObject"
                :godDamageType="godDamageType"
                :godBasicAttackType="godBasicAttackType"
              />
            </div>
          </div>
          <!-- This row will hold ability icons -->
          <div class="row mt-2 bg-secondary text-white justify-content-center">
            <div class="col">
              <div class="row justify-content-center text-center">
                <div class="col">
                  <h1>Abilities</h1>
                </div>
              </div>
              <GodAbilitiesMain
                :ability1="godObject.Ability_1"
                :ability2="godObject.Ability_2"
                :ability3="godObject.Ability_3"
                :ability4="godObject.Ability_4"
                :ability5="godObject.Ability_5"
              />
            </div>
          </div>

          <!-- This row will hold the items. -->
          <div
            class="row mt-2 p-2 bg-secondary text-white justify-content-center"
          >
            <BuilderItemsMain
              ref="builderItemsMain"
              :godRole="godObject.Roles"
              :godDamageType="godDamageType"
              :godBasicAttackType="godBasicAttackType"
              :godName="godObject.Name"
            />
          </div>

          <!-- This row will hold the share and publish buttons -->
          <div class="row mt-2 bg-secondary text-white justify-content-center">
            <!-- Left side col for share link -->
            <div class="col">
              <div class="row text-center">
                <div class="col">
                  <h2>Share with this Link</h2>
                </div>
              </div>
              <div class="row text-center">
                <div class="col">
                  <h5>Share links on hold for now...</h5>
                </div>
              </div>
            </div>

            <!-- Right side col for the buttons -->
            <div class="col-2">
              <div class="row mt-1 justify-content-center">
                <div class="col">
                  <button
                    @click="clearAllItems"
                    type="button"
                    class="btn btn-outline-warning w-100"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div class="row mt-1 mb-1 justify-content-center">
                <div class="col">
                  <button
                    v-if="$store.state.user.authorized"
                    @click="openPublishModal"
                    type="button"
                    class="btn btn-outline-primary w-100"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    <BuildPublishModal
      name="build-publish-modal"
      :itemIds="equippedItemIds"
      :godId="parseInt(godId)"
    />
  </div>
</template>

<script>
// Imports
import GodCardLarge from "../../components/Gods/GodCardLarge.vue";
import GodStatPill from "../../components/Gods/GodStatPill.vue";
import GodTagsMain from "../../components/Tags/GodTagsMain.vue";
import GodAbilitiesMain from "../../components/Abilities/GodAbilitiesMain.vue";
import BuilderItemsMain from "../../components/Builder/BuilderItemsMain.vue";
import BuildPublishModal from "../../components/Modals/BuildPublishModal.vue";

/**
 * @author Patrick W.
 * @description Build page.
 */
export default {
  head: {
    title: "Create a Build",
  },
  layout: "public",
  components: {
    GodCardLarge,
    GodStatPill,
    GodTagsMain,
    GodAbilitiesMain,
    BuilderItemsMain,
    BuildPublishModal,
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
      equippedItemIds: {},
    };
  },
  /**
   * @description Async mounted function will attempt to get the god from the server.
   */
  mounted: async function () {
    let loader = this.$loading.show();

    try {
      let getGodResponse = await this.$axios.$get(
        `${this.$config.serverUrl}/gods/${this.godId}`
      );

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

        /**
         * For some reason Persephone's basic attack type isn't specified in the api JSON.
         * In the game her basic attacks are ranged so use a special check for that.
         */
        if (this.godObject.Name === "Persephone") {
          this.godBasicAttackType = "Ranged";
        }

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
    /**
     * @description Computed property to parse the level string to an Int.
     */
    currentLevelToInt: function () {
      return parseInt(this.currentLevel);
    },
  },
  methods: {
    openPublishModal: function () {
      const TAG = "\n_godId - openPublishModal(), ";
      console.log(TAG + "Opening publish modal...");
      this.equippedItemIds =
        this.$refs.builderItemsMain.returnEquippedItemIds();
      this.$modal.show("build-publish-modal");
    },
    clearAllItems: function () {
      this.$refs.builderItemsMain.clearAllItemFrames();
    },
  },
};
</script>
