<template>
	<nav>
		<router-link tag="button" to="/widgets">widgets</router-link>
		<router-link tag="button" to="/skills">skills</router-link>
		<router-link tag="button" to="/skills">my home</router-link>
		<router-link tag="button" to="/skills" v-if="this.$store.state.settings['scenariosActive']">scenarios</router-link>
		<router-link tag="button" to="/skills">syslog</router-link>
		<router-link tag="button" to="/skills">alicewatch</router-link>
		<router-link tag="button" to="/skills">admin</router-link>
		<router-link tag="button" to="/skills" v-if="this.$store.state.settings['devMode']">devmode</router-link>
	</nav>
</template>

<script src="../js/nav.js"></script>
