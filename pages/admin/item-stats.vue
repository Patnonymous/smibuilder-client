<template>
  <div class="container-fluid">
    <div>
      <!-- Page header and date. -->
      <div class="row">
        <div class="col">
          <h1>Current Item Usage Stats</h1>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col">
          <canvas ref="refChartItemStats"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports.
import Chart from "chart.js/auto";
export default {
  head: {
    title: "Item Usage Stats",
  },
  name: "item-stats",
  layout: "default",
  components: {},
  data: function () {
    return {
      itemUsageStats: {},
    };
  },
  mounted: async function () {
    // Enable loader.
    let loader = this.$loading.show();

    // Set store page name.
    this.$store.commit("navigation/changePage", "Admin");

    try {
      // Get item stats.
      let itemsStatsResponse = await this.$axios.post(
        `${this.$config.serverUrl}/stats/get/item-stats`,
        {
          token: this.$cookies.get("auth"),
          userId: this.$store.state.user.currentUser.userId,
        }
      );
      let data = itemsStatsResponse.data;
      if (data.status === "Failure") {
        this.$notify({
          title: "Item Stats Error",
          text: `An error has occurred: ${data.resData}`,
          duration: 6000,
          type: "error",
        });
        loader.hide();
      } else if (data.status === "Success") {
        this.itemUsageStats = data.resData;

        // Item stats.
        let arrayItemStats = [];
        for (const item in this.itemUsageStats) {
          arrayItemStats.push(this.itemUsageStats[item]);
        }
        arrayItemStats = arrayItemStats.sort((a, b) => {
          if (a.numberOfHits < b.numberOfHits) {
            return -1;
          } else if (a.numberOfHits > b.numberOfHits) {
            return 1;
          } else {
            return 0;
          }
        });
        let arrayItemNames = [];
        let arrayItemHits = [];
        arrayItemStats.forEach((item) => {
          arrayItemNames.push(item.itemData.DeviceName);
          arrayItemHits.push(item.numberOfHits);
        });

        const itemsCtx = this.$refs.refChartItemStats;
        const itemsChart = new Chart(itemsCtx, {
          type: "bar",
          data: {
            labels: arrayItemNames,
            datasets: [
              {
                label: "Times Used in Builds",
                data: arrayItemHits,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        loader.hide();
      }
    } catch (error) {
      this.$notify({
        title: "Item Stats Error",
        text: `An error has occurred: ${error.message}`,
        duration: 6000,
        type: "error",
      });
      loader.hide();
    }
  },
  computed: {},
  methods: {},
};
</script>
