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
			<button v-else v-tooltip="$t('nav.widgets')" class="minimized"><i aria-hidden="true" class="fab fa-windows"/>
			</button>
		</router-link>
		<router-link to="/skills" v-if="this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.skills') }}</button>
			<button v-else v-tooltip="$t('nav.skills')" class="minimized"><i aria-hidden="true" class="fas fa-brain"/>
			</button>
		</router-link>
		<router-link to="/myhome">
			<button v-if="!$store.state.minimized">{{ $t('nav.myhome') }}</button>
			<button v-else v-tooltip="$t('nav.myhome')" class="minimized"><i aria-hidden="true" class="fas fa-home"/></button>
		</router-link>
		<router-link to="/scenarios" v-if="this.$store.state.loggedInUser && this.$store.state.settings['scenariosActive']">
			<button v-if="!$store.state.minimized">{{ $t('nav.scenarios') }}</button>
			<button v-else v-tooltip="$t('nav.scenarios')" class="minimized"><i aria-hidden="true" class="fas fa-sitemap"/>
			</button>
		</router-link>
		<router-link to="/syslog" v-if="this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.syslog') }}</button>
			<button v-else v-tooltip="$t('nav.syslog')" class="minimized"><i aria-hidden="true" class="fas fa-file-alt"/>
			</button>
		</router-link>
		<router-link to="/alicewatch" v-if="this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.alicewatch') }}</button>
			<button v-else v-tooltip="$t('nav.alicewatch')" class="minimized"><i aria-hidden="true" class="fas fa-eye"/>
			</button>
		</router-link>
		<router-link v-if="this.$store.state.loggedInUser && this.$store.state.loggedInUser.authLevel === 'admin'" to="/dialogView">
			<button v-if="!$store.state.minimized">{{ $t('nav.dialogView') }}</button>
			<button v-else v-tooltip="$t('nav.dialogView')" class="minimized"><i aria-hidden="true" class="fas fa-comments"/>
			</button>
		</router-link>
		<router-link v-if="this.$store.state.loggedInUser && this.$store.state.loggedInUser.authLevel === 'admin'" to="/telemetry">
			<button v-if="!$store.state.minimized">{{ $t('nav.telemetry') }}</button>
			<button v-else v-tooltip="$t('nav.telemetry')" class="minimized"><i aria-hidden="true" class="fas fa-database"/>
			</button>
		</router-link>
		<router-link to="/devmode" v-if="this.$store.state.settings['devMode'] && this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.devmode') }}</button>
			<button v-else v-tooltip="$t('nav.devmode')" class="minimized"><i aria-hidden="true" class="fab fa-dev"/></button>
		</router-link>
		<router-link to="/admin" v-if="this.$store.state.loggedInUser && this.$store.state.loggedInUser.authLevel === 'admin'">
			<button v-if="!$store.state.minimized">{{ $t('nav.admin') }}</button>
			<button v-else v-tooltip="$t('nav.admin')" class="minimized"><i aria-hidden="true" class="fas fa-tools"/></button>
		</router-link>
		<a class="nav-link" @click="minimize" v-if="!this.$store.state.minimized">
			<button>{{ $t('buttons.minimize') }}</button>
		</a>
		<a class="nav-link" @click="maximize" v-if="this.$store.state.minimized">
			<button class="minimized"><i class="fas fa-chevron-right" aria-hidden="true"/></button>
		</a>
		<router-link class="lastItem" to="/login" v-if="!this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.login') }}</button>
			<button v-else v-tooltip="$t('nav.login')" class="minimized"><i aria-hidden="true" class="fas fa-sign-in-alt"/>
			</button>
		</router-link>
		<a class="nav-link lastItem" @click="logout" v-if="this.$store.state.loggedInUser">
			<button v-if="!$store.state.minimized">{{ $t('nav.logout') }}</button>
			<button v-else v-tooltip="$t('nav.logout')" class="minimized"><i aria-hidden="true" class="fas fa-sign-out-alt"/>
			</button>
		</a>
	</nav>
</template>

<style src="../css/nav.css" scoped></style>
<script src="../js/nav.js"></script>
