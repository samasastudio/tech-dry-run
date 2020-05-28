
<template>  
  <div>
    <div class="text-left">
        <div class="mx-auto">
            <div class="">
                <form class="form-inline search-bx" v-bind:class="{ init: init }" @submit.prevent="search">                
                    <div class="form-group mb-2 mt-2 p-0">
                        <input type="text" class="form-control tw-input" v-model="name" />
                    </div>
                    <div class="form-group mb-2 ">
                        <button type="submit" class="btn btn-primary">Search</button>
                    </div>
                    <!-- <div class="w-100 small" v-if="!init">
                        <button class="btn btn-sm btn-link">Overview</button> <button class="btn btn-sm btn-link">Timeline</button>
                    </div> -->
                </form>
            </div>
        </div>

        <div class="user-wrap" v-bind:class="{ loading: loading }">
            <div class="text-white inline xm-auto" v-if="user">
                <div class="user-inner">
                    <div class="row">
                        <div class="col pr-0">
                            <span class="avatar-wrap">
                                <img :src="user.profile_image_url" class="avatar"/>
                            </span>
                        </div>
                        <div class="col text-left">
                            <span class="avatar-name label">{{ user.name }}</span>
                            <div class="small avatar-description">{{ user.description }}</div>
                            <div><a target="_blank" class="small" :href="'https://twitter.com/'+name">Twitter Profile</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="loader text-black text-center">                
                <div class="user-inner">
                    <div>
                        <img src="loader.svg" />
                    </div>
                    Grabbing Tweets... Analysing... Graphing...
                </div>
            </div>
            <div v-if="error">
                <div class="user-inner label">
                    {{ error }}
                </div>
            </div>
        </div>
        <!-- <div>
            <div v-for="(tweet) in tweets" v-bind:key="tweet.utterance_id">
                <div class="p6">
                    {{ tweet.utterance_text }}<br>
                </div>
                <div v-if="tweet.tones.length > 0">
                    <div v-for="(tone) in tweet.tones" v-bind:key="tone.tone_id">
                        {{ tone.tone_name }} - {{ tone.score }}
                    </div>
                </div>
            </div>
        </div>             -->
        <div >     
            <div class="legend-wrap">
                <div class="d-flex" v-for="(setting, index) in settings" v-bind:key="index">
                    <span class="legend-color inline m-1 mr-2" v-bind:style="{ backgroundColor: setting.color}"></span>
                    <label class="legend-text m-0" for="">{{ setting.count }} {{ index }}</label>
                </div>
            </div>
            <line-chart-overview v-on:click="changeView('overview')" v-if="graph == 'overview'" class="graph-wrap" :chart-data="datacollection"></line-chart-overview>
            <!-- <line-chart-timeline v-on:click="changeView('timeline')" v-if="graph == 'timeline'" class="graph-wrap" :chart-data="datacollection"></line-chart-timeline> -->
        </div>
    </div>
  </div>
</template>


<script>
    import axios from 'axios'    
    import LineChartOverview from './chart-overview.js'
    import LineChartTimeline from './chart-timeline.js'

    export default {        
        components: {
            LineChartOverview,
            LineChartTimeline
        },
        data: function(){
            return {
                message: 'Loading Analytics',
                name: 'Jim_Jordan',
                tweets: null,
                mood: null,
                init: true,
                graph: 'overview',
                loading: false,
                user: null,
                datacollection: null,
                gradient: null,
                error: false,
                settings: {
                    fear:{
                        color: '#6610f2',
                        count: 0,
                        impact:-1
                    },
                    anger: {
                        color: '#dc3545',
                        count: 0,
                        impact:-1
                    },                    
                    sadness:{
                        color: '#fd7e14',
                        count: 0,
                        impact:-1
                    },
                    tentative: {
                        color: '#ffc107',
                        count: 0,
                        impact:-1
                    },                                        
                    analytical: {
                        color: '#17a2b8',
                        count: 0,
                        impact:1
                    },
                    confident:{
                        color: '#20c997',
                        count: 0,
                        impact:1
                    },
                    joy:{
                        color: '#28a745',
                        count: 0,
                        impact:1
                        //color: this.gradient
                    },                    
                    
                }
            }
        },
        mounted() {
            var vm = this;     
            
            //SETUP GRAD
            this.gradient = window.graph.getContext('2d').createLinearGradient(0, 0, 0, 450)
            this.gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
            this.gradient.addColorStop(1, 'rgba(255, 0,0, 1)')                        
            //vm.fillData();
        },
        watch: {           
        },
        methods:{     
            changeView: function(graphSelection){
                let vm = this;
                vm.graph = graphSelection;
                this.fillData();
            },    
            search: function(){
                let vm = this;
                vm.loading = true;
                vm.tweets   = null;
                vm.error = false;
                vm.moods    = null;
                vm.user     = null;
                vm.fillData(true);
                vm.init = false;

                axios
                .post(`/search`,{
                    screen_name: vm.name
                },{ timeout: 15000 })
                .then(function(response){
                     console.log(response);

                    if(response.data.type && response.data.type == 'error'){
                        vm.status = null;
                        vm.loading = false;
                        console.log(response.data.err[0].message)
                        return vm.error = response.data.err[0].message;
                    }
                    vm.tweets = response.data.tweets;
                    vm.moods = response.data.moods;
                    vm.user = response.data.user;
                    vm.status = null;
                    vm.fillData();
                    vm.loading = false;
                }).catch(function(err){ 
                    console.log(err); 
                    if(err.code == 'ECONNABORTED'){
                        vm.loading = false;
                        vm.error = 'An error may mave occurred, try again';
                    }
                })
            },
            fillData (reset) {
                
                let vm = this;
                let labels = ['','','','',''];
                let datasets = [];

                if(reset){
                    let _data = [];
                    if( (this.datacollection !== null) ){
                        this.datacollection.datasets.forEach( line =>{
                            line.data = [0,0, 0, 0,0];
                            _data.push(line);
                        })
                    }
                    return (this.datacollection === null) ? false : this.datacollection = {
                        labels: labels,
                        datasets: _data
                    }
                }

                if( vm.graph == 'overview'){
                    let labels = ['','','','',''];

                    let min = 1;
                    vm.tweets.forEach(tweet => {
                        tweet.tones.forEach(tone => {
                            min = (min < tone.score) ? min : tone.score;
                        })
                    })
                     vm.tweets.forEach(tweet => {
                        tweet.tones.forEach(tone => {
                            let _settings = vm.settings[tone.tone_id];
                            //console.log(tone);
                            _settings.count++;
                            datasets.push({
                                label: JSON.stringify({
                                    toneid: tone.tone_id,
                                    color: _settings.color,
                                    tone: tone.tone_name,
                                    val: tone.score,
                                    tweet: tweet.text

                                }),
                                backgroundColor: _settings.color,
                                borderColor: _settings.color,
                                fill: false,
                                data: [0,0, _settings.impact*tone.score, 0,0],
                                pointRadius: 0,
                                borderWidth: 1,
                            });        
                        });            
                    });

                }else{
                    let labels = [];
                    vm.tweets.forEach(tweet => {
                        tweet.tones.forEach(tone => {
                            //labels.push();
                        })
                    })
                }

                //OVERALL
                // let min = vm.moods.reduce((min, p) => p.score < min ? p.score : min, vm.moods[0].score);
                // vm.moods.forEach(mood => {
                //     let _settings = settings[mood.tone_id];
                //     datasets.push({
                //         label: mood.tone_name,
                //         backgroundColor: _settings.color,
                //         borderColor: _settings.color,
                //         fill: false,
                //         data: [min, min, mood.score, min, min],
                //         pointRadius: 0,
                //         borderWidth: 1,
                //     });                    
                // });

                

               

                this.datacollection = {
                    labels: labels,
                    datasets: datasets
                }

                //console.log( window.graph );
                //window.graph.height = '500';
                //console.log(window.graph);
            }            
        }         
    }
</script>