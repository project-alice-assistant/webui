<template>
	<div class="mainContainer">
		<pa-main v-if="$store.state.uiConnected"/>
		<pa-connect v-else/>
	</div>
</template>

<script src="./ProjectAlice.js"/>

<style src="./components/css/fa/brands.css"/>
<style src="./components/css/fa/regular.css"/>
<style src="./components/css/fa/solid.css"/>
<style src="./components/css/fa/fontawesome.css"/>
