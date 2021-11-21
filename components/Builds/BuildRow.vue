<template>
  <div class="row mt-2 mb-2 rounded">
    <!-- Col for likes and dislikes. -->
    <div class="col-auto">
      <div class="row">
        <div class="col">
          <span class="text-success">{{ buildData.likes }} likes</span>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <span class="text-danger">{{ buildData.dislikes }} dislikes</span>
        </div>
      </div>
    </div>

    <!-- Col for tiny god card img preview -->
    <div class="col-auto">
      <div class="col p-1 bg-dark rounded text-center">
        <div class="card" style="width: 5rem; height: 5rem">
          <img
            v-b-tooltip.hover
            :title="buildData.godData.Name"
            class="card-img-top"
            :src="buildData.godData.godIcon_URL"
            alt="God Icon"
          />
        </div>
      </div>
    </div>

    <!-- Col for build preview. -->
    <div class="col">
      <!-- Row for build title and creator. -->
      <div class="row">
        <div class="col">
          <h4>{{ buildData.title }} - {{ buildData.godData.Name }}</h4>
        </div>
        <div class="col">
          <h5>By {{ buildData.ownerName }}</h5>
        </div>
      </div>
      <!-- Row for the build preview. -->
      <div class="row">
        <!-- Consumables -->
        <div class="col-auto bg-info rounded mt-2 mb-2">
          <div class="row">
            <ItemFrameTiny
              v-for="(consumable, index) in buildData.items.consumables"
              :key="index"
              :itemData="consumable"
              frameType="consumable"
            />
          </div>
        </div>
        <!-- Relics -->
        <div class="col-auto bg-info rounded mt-2 mb-2"></div>
        <!-- Main Items -->
        <div class="col-auto bg-info rounded mt-2 mb-2"></div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports
import ItemFrameTiny from "../Items/ItemFrameTiny.vue";
export default {
  name: "BuildRow",
  components: {
    ItemFrameTiny,
  },
  props: {
    buildData: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    return {};
  },
  mounted: async function () {
    console.log(this.buildData);
  },
  computed: {},
  methods: {},
};
</script>
