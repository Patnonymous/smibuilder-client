<template>
  <!-- Filter by class main holder row -->
  <div class="row mb-2 justify-content-center pb-4 bg-primary rounded">
    <div class="col p-1">
      <!-- Filer by class header -->
      <div class="row justify-content-center">
        <b-button v-b-toggle="filterGroup">Toggle Collapse</b-button>
      </div>

      <b-collapse :id="filterGroup">
        <!-- A filter row for each chunk. -->
        <div
          class="row m-1 justify-content-center border border-success"
          v-for="(chunk, index) in filterChunk"
          :key="index"
        >
          <div
            class="col m-1"
            v-for="filterString in chunk"
            :key="filterString"
            :customVar="filterChunk.length"
          >
            <!-- Row to contain the checkbox and label -->
            <div class="row justify-content-center bg-white">
              <!-- Column for checkbox -->
              <div class="col-2 border border-warning">
                <input
                  class=""
                  type="checkbox"
                  :id="filterString"
                  :value="filterString"
                />
              </div>
              <!-- Column for label -->
              <div class="col p-0 border border-primary">
                <label
                  class="
                    form-check-label
                    w-100
                    text-center
                    border border-danger
                  "
                  :for="filterString"
                >
                  {{ filterString }}
                </label>
              </div>
            </div>
          </div>

          <!-- This is some dumb shit. Adds an invisible dummy column if the current chunk is 1.
        This is so the last filter column is forced to the left. -->
          <div class="col m-1 invisible" v-if="filterChunk[index].length === 1">
            <!-- Row to contain the checkbox and label -->
            <div class="row justify-content-center bg-white">
              <!-- Column for checkbox -->
              <div class="col-2 border border-warning">
                <input class="" type="checkbox" id="fooBar" value="fooBar" />
              </div>
              <!-- Column for label -->
              <div class="col p-0 border border-primary">
                <label
                  class="
                    form-check-label
                    w-100
                    text-center
                    border border-danger
                  "
                  for="fooBar"
                >
                  fooBar
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Toggle all -->
        <div class="row m-1 justify-content-center border border-success">
          <div class="col-auto m-1">
            <!-- Row to contain the checkbox and label -->
            <div class="row justify-content-center bg-white">
              <!-- Column for checkbox -->
              <div class="col-2 border border-warning">
                <input
                  class=""
                  type="checkbox"
                  :id="concatToggleAllId"
                  :value="concatToggleAllId"
                />
              </div>
              <!-- Column for label -->
              <div class="col p-0 border border-primary">
                <label
                  class="
                    form-check-label
                    w-100
                    text-center
                    border border-danger
                  "
                  :for="concatToggleAllId"
                >
                  {{ concatToggleAllId }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "FilterPanel",
  components: {},
  props: {
    filterGroup: {
      type: String,
      required: true,
    },
    arrayOfFilterStrings: {
      type: Array,
      required: true,
    },
  },
  data: function () {
    return {
      selectedFilters: [],
      ribbleVar: "ribble",
    };
  },
  mounted: async function () {},
  computed: {
    filterChunk: function () {
      return this.lodash.chunk(this.arrayOfFilterStrings, 2);
    },
    concatToggleAllId: function () {
      let concatString = "filter" + this.filterGroup + "ToggleAll";
      return concatString;
    },
  },
  methods: {},
};
</script>
