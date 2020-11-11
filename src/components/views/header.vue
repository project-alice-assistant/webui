<template>
	<header>
		<div class="pageTitle">{{ title }}</div>
		<div id="aliceStatus" class="aliceStatus"></div>
		<div class="resourceUsage" v-if="this.$store.state.settings['displaySystemUsage']">
			CPU: {{ this.$store.state.resourceUsage['cpu'] }}%
			RAM: {{ this.$store.state.resourceUsage['ram'] }}%
			SWP: {{ this.$store.state.resourceUsage['swp'] }}%
		</div>
		<div class="updateChannelMarker"></div>
	</header>
</template>

<style src="../css/header.css" scoped></style>
<script src="../js/header.js"></script>
