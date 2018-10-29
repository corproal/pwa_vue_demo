<template>
  <div id="app">
      <VuePageAnimation>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" transition-mode="out-in" class="vue-page-animation-router-view"></router-view>
        </keep-alive>
      </VuePageAnimation>
      <VuePageAnimation>
          <router-view v-if="!$route.meta.keepAlive" transition-mode="out-in" class="vue-page-animation-router-view"></router-view>
      </VuePageAnimation>
  </div>
</template>

<script>

    import VuePageAnimation from '@/animation/vue-page-animation';

    export default {
      name: 'App',
      data(){
          return {
              transitionName:''
          }
      },
      components: {
          VuePageAnimation
      },
      watch: {
        $route(to, from) {
          if(to.meta.index > from.meta.index){
            this.transitionName = 'slide-left';
          }else{
            this.transitionName = 'slide-right';
          }
        }
      }
    }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}
</style>
