<template>
	<button v-if="microphoneSupport" :class="{red: listening}" @click="toggleListening">
		<i :class="icon" aria-hidden="true"></i>
	</button>
</template>

<style scoped src="../css/micStreamer.css"></style>
<script src="../js/micStreamer.js"></script>
