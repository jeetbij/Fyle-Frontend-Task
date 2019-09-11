<template>
  <div id="app">
    <bank-detail></bank-detail>
  </div>
</template>

<script>
import BankDetail from './components/BankDetail.vue'

export default {
  name: 'app',
  components: {
    BankDetail
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
