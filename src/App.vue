<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <form-schema></form-schema>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import FormSchema from './components/FormSchema.vue'

export default {
  name: 'app',
  components: {
    // HelloWorld,
    FormSchema
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
*, :after, :before {
  box-sizing: border-box;
}
</style>
