import VueLoading from 'vue-loading-overlay';
import Vue from 'vue';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.use(VueLoading, {
    color: "green",
    height: 128,
    width: 128,
});