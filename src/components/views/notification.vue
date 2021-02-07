<template>
	<span class="notification clickable">{{ notification.data }}</span>
</template>

<script>
export default {
	name: 'notification',
	props: [
		'notification'
	]
}
</script>

<style scoped>
.notification {
	font-size: 1em;
	overflow: hidden;
	width: 100%;
}
</style>
