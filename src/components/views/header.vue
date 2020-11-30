<template>
	<header :class="{collapsed: this.$store.state.fullScreen}">
		<div class="pageTitle">{{ title }}</div>
		<div id="aliceStatus" class="aliceStatus"></div>
		<div class="resourceUsage" v-if="this.$store.state.settings['displaySystemUsage']">
			CPU: {{ resources.cpu }}%
			RAM: {{ resources.ram }}%
			SWP: {{ resources.swp }}%
		</div>
		<div class="versionInfo">
			{{$store.state.settings.aliceVersion}}
		</div>
		<div class="channelInfo">
			{{$store.state.settings.aliceUpdateChannel}}
		</div>
		<div class="updateChannelMarker"></div>
	</header>
</template>

<style src="../css/header.css" scoped></style>
<script src="../js/header.js"></script>
