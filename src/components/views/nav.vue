<template>
	<nav :class="{collapsed: this.$store.state.fullScreen}">
		<router-link tag="button" to="/widgets">{{ $t('nav.widgets') }}</router-link>
		<router-link tag="button" to="/skills" v-if="this.$store.state.loggedInUser">{{ $t('nav.skills') }}</router-link>
		<router-link tag="button" to="/widgets">{{ $t('nav.myhome') }}</router-link>
		<router-link tag="button" to="/scenarios" v-if="this.$store.state.loggedInUser && this.$store.state.settings['scenariosActive']">{{ $t('nav.scenarios') }}</router-link>
		<router-link tag="button" to="/syslog" v-if="this.$store.state.loggedInUser">{{ $t('nav.syslog') }}</router-link>
		<router-link tag="button" to="/alicewatch" v-if="this.$store.state.loggedInUser">{{ $t('nav.alicewatch') }}</router-link>
		<router-link tag="button" to="/devmode" v-if="this.$store.state.settings['devMode'] && this.$store.state.loggedInUser">{{ $t('nav.devmode') }}</router-link>
		<router-link tag="button" to="/admin" v-if="this.$store.state.loggedInUser && this.$store.state.loggedInUser.authLevel === 'admin'">{{ $t('nav.admin') }}</router-link>
		<router-link tag="button" class="lastItem" to="/login" v-if="!this.$store.state.loggedInUser">{{ $t('nav.login') }}</router-link>
		<button class="lastItem" v-if="this.$store.state.loggedInUser" @click="logout">{{ $t('nav.logout') }}</button>
	</nav>
</template>

<style src="../css/nav.css" scoped></style>
<script src="../js/nav.js"></script>
