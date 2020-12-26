<template>
	<nav
		:class="{
			collapsed: this.$store.state.fullScreen,
			minimized: this.$store.state.minimized && !this.$store.state.fullScreen,
			retract: animateRetract,
			extend: animateExtend
		}"
		@animationend="endAnimations"
		>
		<router-link to="/widgets">
			<button v-if="!$store.state.minimized">{{ $t('nav.widgets') }}</button>
			<button class="minimized" v-else><i class="fab fa-windows" aria-hidden="true"/></button>
		</router-link>
		<router-link to="/skills" v-if="this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.skills') }}</button>
			<button class="minimized" v-else><i class="fas fa-brain" aria-hidden="true"/></button>
		</router-link>
		<router-link to="/myhome">
			<button v-if="!$store.state.minimized">{{ $t('nav.myhome') }}</button>
			<button class="minimized" v-else><i class="fas fa-home" aria-hidden="true"/></button>
		</router-link>
		<router-link to="/scenarios" v-if="this.$store.state.loggedInUser && this.$store.state.settings['scenariosActive']">
			<button v-if="!$store.state.minimized">{{ $t('nav.scenarios') }}</button>
			<button class="minimized" v-else><i class="fas fa-sitemap" aria-hidden="true"/></button>
		</router-link>
		<router-link to="/syslog" v-if="this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.syslog') }}</button>
			<button class="minimized" v-else><i class="fas fa-file-alt" aria-hidden="true"/></button>
		</router-link>
		<router-link to="/alicewatch" v-if="this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.alicewatch') }}</button>
			<button v-else class="minimized"><i aria-hidden="true" class="fas fa-eye"/></button>
		</router-link>
		<router-link v-if="this.$store.state.loggedInUser && this.$store.state.loggedInUser.authLevel === 'admin'" to="/dialogView">
			<button v-if="!$store.state.minimized">{{ $t('nav.dialogView') }}</button>
			<button v-else class="minimized"><i aria-hidden="true" class="fas fa-comments"/></button>
		</router-link>
		<router-link v-if="this.$store.state.loggedInUser && this.$store.state.loggedInUser.authLevel === 'admin'" to="/telemetry">
			<button v-if="!$store.state.minimized">{{ $t('nav.telemetry') }}</button>
			<button v-else class="minimized"><i aria-hidden="true" class="fas fa-database"/></button>
		</router-link>
		<router-link to="/devmode" v-if="this.$store.state.settings['devMode'] && this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.devmode') }}</button>
			<button class="minimized" v-else><i class="fab fa-dev" aria-hidden="true"/></button>
		</router-link>
		<router-link to="/admin" v-if="this.$store.state.loggedInUser && this.$store.state.loggedInUser.authLevel === 'admin'">
			<button v-if="!$store.state.minimized">{{ $t('nav.admin') }}</button>
			<button class="minimized" v-else><i class="fas fa-tools" aria-hidden="true"/></button>
		</router-link>
		<a class="nav-link" @click="minimize" v-if="!this.$store.state.minimized">
			<button>{{ $t('buttons.minimize') }}</button>
		</a>
		<a class="nav-link" @click="maximize" v-if="this.$store.state.minimized">
			<button class="minimized"><i class="fas fa-chevron-right" aria-hidden="true"/></button>
		</a>
		<router-link class="lastItem" to="/login" v-if="!this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.login') }}</button>
			<button class="minimized" v-else><i class="fas fa-sign-in-alt" aria-hidden="true"/></button>
		</router-link>
		<a class="nav-link lastItem" @click="logout" v-if="this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.logout') }}</button>
			<button class="minimized" v-else><i class="fas fa-sign-out-alt" aria-hidden="true"/></button>
		</a>
	</nav>
</template>

<style src="../css/nav.css" scoped></style>
<script src="../js/nav.js"></script>
