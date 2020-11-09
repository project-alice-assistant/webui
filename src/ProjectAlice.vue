<template>
  <div id="mainContainer">
    <pa-header/>
    <div id="main">
      <pa-nav/>
      <pa-content/>
    </div>
  </div>
</template>

<script>
import paHeader from './components/vue/header'
import paNav from './components/vue/nav'
import paContent from './components/vue/content'

export default {
  name: 'ProjectAlice',
  components: {
    paHeader,
    paNav,
    paContent
  }
}
</script>

<style src="./ProjectAlice.css"></style>
