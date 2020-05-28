import { Line, mixins } from 'vue-chartjs'
 
export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ["chartData"],
  computed: {
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false          
        },
        tooltips: {          
          enabled: false,
          custom: function(tooltipModel) {
            let vm = this;
            popup.content(tooltipModel, vm);
          }
        },
        // tooltips: {
        //   mode: "index",
        //   intersect: false
        // },
        hover: {
          // mode: "nearest",
          intersect: false
        },
        scaleGridLineWidth: 0,
        scaleLineColor: "rgba(0,0,0,0)",
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 10,
            bottom: 10
          }
        },
        scales: {
          yAxes: [
            {
              display: false,
              gridLines: {
                lineWidth: 0,
                drawBorder: false
              },
              ticks: {
                display: false
              }
            }
          ],
          xAxes: [
            {
              display: false,
              gridLines: {
                lineWidth: 0,
                drawBorder: false
              },
              ticks: {
                display: false
              }
            }
          ]
        }
      };
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
    window.graph = this.$refs.canvas;
  }
};