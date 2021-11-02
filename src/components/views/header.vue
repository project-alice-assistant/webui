<template>
	<header :class="{collapsed: this.$store.state.fullScreen}">
		<div class="pageTitle">{{ title }}</div>
		<div id="aliceStatus" class="aliceStatus"></div>
		<div v-if="this.$store.state.settings['displaySystemUsage']" class="resourceUsage">
			CPU: {{ resources.cpu }}%
			SWP: {{ resources.swp }}%
			RAM: {{ resources.ram }}%
		</div>
		<div class="versionInfo">
			{{ $store.state.settings['aliceVersion'] }}
		</div>
		<div class="channelInfo">
			{{ $store.state.settings['aliceUpdateChannel'] }}
		</div>
		<div v-if="Object.keys(notifications).length !== 0" class="notifications">
			<i aria-hidden="false" class="fas fa-envelope clickable notificationIcon" @click="notificationsDisplayToggle = !notificationsDisplayToggle"/>
			<div v-if="notificationsDisplayToggle" class="notificationHolder">
				<notification v-for="notification in notifications" :key="notification.id" :notification="notification"/>
			</div>
		</div>
	</header>
</template>

<style scoped src="../css/header.css"/>
<script src="../js/header.js"/>
