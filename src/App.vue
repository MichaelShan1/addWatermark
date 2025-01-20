<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/index.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
*, *::before, *::after {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  
}
</style>
