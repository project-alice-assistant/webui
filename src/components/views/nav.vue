<template>
	<nav>
		<router-link tag="button" to="/widgets">widgets</router-link>
		<router-link tag="button" to="/skills" v-if="this.$store.state.loggedInUser">skills</router-link>
		<router-link tag="button" to="/skills">my home</router-link>
		<router-link tag="button" to="/scenarios" v-if="this.$store.state.settings['scenariosActive']">scenarios</router-link>
		<router-link tag="button" to="/skills" v-if="this.$store.state.loggedInUser">syslog</router-link>
		<router-link tag="button" to="/skills" v-if="this.$store.state.loggedInUser">alicewatch</router-link>
		<router-link tag="button" to="/skills" v-if="this.$store.state.settings['devMode'] && this.$store.state.loggedInUser">devmode</router-link>
		<router-link tag="button" to="/skills" v-if="this.$store.state.loggedInUser">admin</router-link>
		<router-link tag="button" class="lastItem" to="/login" v-if="!this.$store.state.loggedInUser">login</router-link>
		<button class="lastItem" v-if="this.$store.state.loggedInUser" @click="logout">logout</button>
	</nav>
</template>

<style src="../css/nav.css" scoped></style>
<script src="../js/nav.js"></script>
