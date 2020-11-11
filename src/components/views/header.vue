<template>
	<header>
		<div class="pageTitle">{{ title }}</div>
		<div id="aliceStatus" class="aliceStatus"></div>
		<div class="resourceUsage" v-if="this.$store.state.settings['displaySystemUsage']">{{ systemUsage }}</div>
		<div class="updateChannelMarker"></div>
	</header>
</template>

<style src="../css/header.css" scoped></style>
<script src="../js/header.js"></script>
