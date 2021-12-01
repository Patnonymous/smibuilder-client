<template>
  <div class="container">
    <div>
      <!-- Page header and date. -->
      <div class="row">
        <div class="col">
          <h1>Site Stats</h1>
        </div>
      </div>

      <div class="row">
        <div class="col-auto">
          <p>We've been logging stats since: {{ displayDatePretty }}</p>
        </div>
      </div>

      <!-- Most active users. -->
      <div class="row">
        <div class="col-auto">
          <h2>Most Active Users:</h2>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <canvas ref="refChartCanvas"></canvas>
        </div>
      </div>

      <!-- Recent requests log. -->
      <div class="row">
        <div class="col-auto">
          <h2>Recent Requests:</h2>
        </div>
      </div>

      <div class="row">
        <div class="col-auto">
          <ul>
            <li
              v-for="(
                logString, index
              ) in siteStatsObject.lastTwentyFiveRequests"
              :key="index"
            >
              {{ index + 1 }} - {{ logString }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Imports.
import Chart from "chart.js/auto";
export default {
  name: "site-stats",
  layout: "default",
  components: {},
  data: function () {
    return {
      siteStatsObject: {},
      loadedAndReady: false,
    };
  },
  mounted: async function () {
    // Enable loader.
    let loader = this.$loading.show();
    // Set store page name.
    this.$store.commit("navigation/changePage", "Admin");

    // Get site stats.
    let siteStatsResponse = await this.$axios.post(
      `${this.$config.serverUrl}/stats/get/site-stats`,
      {
        token: this.$cookies.get("auth"),
        userId: this.$store.state.user.currentUser.userId,
      }
    );
    if (siteStatsResponse.data.status === "Failure") {
      this.$notify({
        title: "Stats Error",
        text: `An error has occurred: ${siteStatsResponse.data.resData}`,
        duration: 6000,
        type: "error",
      });
      loader.hide();
    } else if (siteStatsResponse.data.status === "Success") {
      this.siteStatsObject = siteStatsResponse.data.resData;
      this.siteStatsObject.lastTwentyFiveRequests.reverse();

      // User Stats.
      // Array of users.
      let arrayUserNames = [];
      let arrayUserHits = [];
      for (const user in this.siteStatsObject.userStats) {
        arrayUserNames.push(this.siteStatsObject.userStats[user].userName);
        arrayUserHits.push(this.siteStatsObject.userStats[user].numberOfHits);
      }
      console.log("arrayUserNames: ", arrayUserNames);
      console.log("arrayUserHits: ", arrayUserHits);

      // Set up chart.
      const ctx = this.$refs.refChartCanvas;
      const usersChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: arrayUserNames,
          datasets: [
            {
              label: "Number of Hits",
              data: arrayUserHits,
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

      // Page is ready.
      this.loadedAndReady = true;
      loader.hide();
    }
    // DEBUG
    console.log(this.siteStatsObject);
  },
  computed: {
    displayDatePretty: function () {
      return new Date(this.siteStatsObject.dateLoggerInitialized).toUTCString();
    },
  },
  methods: {},
};
</script>
