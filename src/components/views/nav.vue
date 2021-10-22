<template>
	<nav
		:class="{
			collapsed: this.$store.state.fullScreen,
			minimized: forceMinimized || this.$store.state.minimized && !this.$store.state.fullScreen,
			retract: animateRetract,
			extend: animateExtend
		}"
		@animationend="endAnimations"
	>
		<router-link to="/widgets">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.widgets') }}</button>
			<button v-else v-tooltip="$t('nav.widgets')" class="minimized"><i aria-hidden="true" class="fab fa-windows"/>
			</button>
		</router-link>
		<router-link v-if="this.$store.state.loggedInUser" to="/skills">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.skills') }}</button>
			<button v-else v-tooltip="$t('nav.skills')" class="minimized"><i aria-hidden="true" class="fas fa-brain"/>
			</button>
		</router-link>
		<router-link to="/myhome">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.myhome') }}</button>
			<button v-else v-tooltip="$t('nav.myhome')" class="minimized"><i aria-hidden="true" class="fas fa-home"/></button>
		</router-link>
		<router-link v-if="this.$store.state.loggedInUser && this.$store.state.settings['scenariosActive']" to="/scenarios">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.scenarios') }}</button>
			<button v-else v-tooltip="$t('nav.scenarios')" class="minimized"><i aria-hidden="true" class="fas fa-sitemap"/>
			</button>
		</router-link>
		<router-link v-if="this.$store.state.loggedInUser" to="/syslog">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.syslog') }}</button>
			<button v-else v-tooltip="$t('nav.syslog')" class="minimized"><i aria-hidden="true" class="fas fa-file-alt"/>
			</button>
		</router-link>
		<router-link v-if="this.$store.state.loggedInUser" to="/alicewatch">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.alicewatch') }}</button>
			<button v-else v-tooltip="$t('nav.alicewatch')" class="minimized"><i aria-hidden="true" class="fas fa-eye"/>
			</button>
		</router-link>
		<router-link v-if="this.$store.state.loggedInUser && this.$store.state.loggedInUser.authLevel === 'admin'" to="/dialogView">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.dialogView') }}</button>
			<button v-else v-tooltip="$t('nav.dialogView')" class="minimized"><i aria-hidden="true" class="fas fa-comments"/>
			</button>
		</router-link>
		<router-link v-if="this.$store.state.loggedInUser && this.$store.state.loggedInUser.authLevel === 'admin'" to="/telemetry">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.telemetry') }}</button>
			<button v-else v-tooltip="$t('nav.telemetry')" class="minimized"><i aria-hidden="true" class="fas fa-database"/>
			</button>
		</router-link>
		<router-link v-if="this.$store.state.settings['devMode'] && this.$store.state.loggedInUser" to="/devmode">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.devmode') }}</button>
			<button v-else v-tooltip="$t('nav.devmode')" class="minimized"><i aria-hidden="true" class="fab fa-dev"/></button>
		</router-link>
		<router-link v-if="this.$store.state.loggedInUser && this.$store.state.loggedInUser.authLevel === 'admin'" to="/admin">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.admin') }}</button>
			<button v-else v-tooltip="$t('nav.admin')" class="minimized"><i aria-hidden="true" class="fas fa-tools"/></button>
		</router-link>
		<a v-if="!this.$store.state.minimized && !forceMinimized" class="nav-link" @click="minimize">
			<button>{{ $t('buttons.minimize') }}</button>
		</a>
		<a v-if="this.$store.state.minimized && !forceMinimized" class="nav-link" @click="maximize">
			<button class="minimized"><i aria-hidden="true" class="fas fa-chevron-right"/></button>
		</a>
		<router-link v-if="!this.$store.state.loggedInUser" class="lastItem" to="/login">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.login') }}</button>
			<button v-else v-tooltip="$t('nav.login')" class="minimized"><i aria-hidden="true" class="fas fa-sign-in-alt"/>
			</button>
		</router-link>
		<a v-if="this.$store.state.loggedInUser" :class="{fullSize: $store.state.minimized || forceMinimized }" class="nav-link lastItem" @click="logout">
			<button v-if="!$store.state.minimized && !forceMinimized">{{ $t('nav.logout') }}</button>
			<button v-else v-tooltip="$t('nav.logout')" class="minimized fullSize">
				<i aria-hidden="true" class="fas fa-sign-out-alt"/>
			</button>
		</a>
	</nav>
</template>

<style scoped src="../css/nav.css"></style>
<script src="../js/nav.js"></script>
