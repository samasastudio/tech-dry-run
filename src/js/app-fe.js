import Vue from 'vue/dist/vue.js';
import axios from 'axios'
import VueAxios from 'vue-axios'
// import Chart from "chart.js";
// Chart.defaults.LineWithLine = 5;
//import { Line } from "vue-chartjs";
//import VueChartJs from "vue-chartjs";
//import Chart from "chart.js";
//import { Bar } from "vue-chartjs";
 
Vue.use(VueAxios, axios);
//Vue.use(Chart, Chart);
//Vue.use(VueChartJs, VueChartJs);

Vue.component(
    "app-home",
    require("./component/home.vue").default
);



var app = new Vue({
    el: '#app',    
});