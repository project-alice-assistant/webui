<template>
	<iframe id="nodered" title="nodered" :src="'//'+this.$store.state.settings['aliceIp']+':1880'"></iframe>
</template>

<style src="../css/scenarios.css" scoped></style>
<script src="../js/scenarios.js"></script>
