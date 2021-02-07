<template>
	<header :class="{collapsed: this.$store.state.fullScreen}">
		<div class="pageTitle">{{ title }}</div>
		<div id="aliceStatus" class="aliceStatus"></div>
		<div class="resourceUsage" v-if="this.$store.state.settings['displaySystemUsage']">
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
		<div class="notifications">
			<i aria-hidden="false" class="fas fa-bell clickable notificationIcon"/>
			<div :class="{initialHidden: true}" class="notificationHolder">
				<notification v-for="(notification, id) in notifications" :key="id" :notification="notification"></notification>
			</div>
		</div>
	</header>
</template>

<style scoped src="../css/header.css"/>
<script src="../js/header.js"/>
