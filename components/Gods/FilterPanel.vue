<template>
  <!-- Filter by class main holder row -->
  <div class="row mb-2 justify-content-center pb-4 bg-primary rounded">
    <div class="col p-1">
      <!-- Filer by class header -->
      <div class="row justify-content-center">
        <div class="col-9">
          <b-button class="btn btn-secondary w-100" v-b-toggle="filterGroup">
            {{ groupTitle }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrows-expand"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"
              />
            </svg>
          </b-button>
        </div>
      </div>

      <b-collapse :id="filterGroup">
        <!-- A filter row for each chunk. -->
        <div
          class="row m-1 justify-content-center"
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
              <div class="col-2 p-0">
                <input
                  class=""
                  style="width: 100%; height: 100%"
                  type="checkbox"
                  :id="filterString"
                  :value="filterString"
                  v-model="selectedFilters"
                  @change="filterPanelCheckboxChanged"
                />
              </div>
              <!-- Column for label -->
              <div class="col p-0">
                <label
                  class="form-check-label w-100 text-center"
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
        <div class="row m-1 justify-content-center">
          <div class="col-6 m-1">
            <!-- Row to contain the checkbox and label -->
            <div class="row justify-content-center bg-white">
              <!-- Column for checkbox -->
              <div class="col-2 p-0">
                <input
                  class=""
                  style="width: 100%; height: 100%"
                  type="checkbox"
                  :id="concatToggleAllId"
                  :value="concatToggleAllId"
                  v-model="selectAll"
                  @change="filterPanelCheckboxChanged"
                />
              </div>
              <!-- Column for label -->
              <div class="col p-0">
                <label
                  class="form-check-label w-100 text-center"
                  :for="concatToggleAllId"
                >
                  Toggle All
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
    groupTitle: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      selectedFilters: [],
    };
  },
  mounted: async function () {},
  computed: {
    /**
     * @description Split the filter strings into chunks.
     */
    filterChunk: function () {
      return this.lodash.chunk(this.arrayOfFilterStrings, 2);
    },
    /**
     * @description Concatenates the filterGroup and returns the string.
     * Used for dynamic IDs and values.
     */
    concatToggleAllId: function () {
      let concatString = "filter" + this.filterGroup + "ToggleAll";
      return concatString;
    },
    /**
     * @description Toggles all the the filters in this panel.
     */
    selectAll: {
      get: function () {
        return this.arrayOfFilterStrings
          ? this.selectedFilters.length === this.arrayOfFilterStrings.length
          : false;
      },
      set: function (value) {
        let selected = [];
        if (value === true) {
          this.arrayOfFilterStrings.forEach(function (filterString) {
            selected.push(filterString);
          });
        } else if (value === false) {
        }
        this.selectedFilters = selected;
      },
    },
  },
  methods: {
    /**
     * @description Creates an object containing the filter group name and the selected filters.
     * The object contains the filterGroup name so the parent can identify where the change is coming from.
     * Then $emits a 'filter-change' event to the parent, along with the object it created.
     */
    filterPanelCheckboxChanged: function () {
      let filterPanelObject = {
        filterGroup: this.filterGroup,
        selectedFilters: this.selectedFilters,
      };
      this.$emit("filter-change", filterPanelObject);
    },
    /**
     * @description Sets the selectAll computed property to false which in turn sets all filters to false (off).
     * Then calls the filterPanelCheckboxChanged() function to notify the parent.
     */
    uncheckAllFilters: function () {
      this.selectAll = false;
      this.filterPanelCheckboxChanged();
    },
  },
};
</script>
