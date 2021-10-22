<template>
	<portal-target id="scenarios-portal-target" name="scenarios-iframe">
		<iframe
			v-show="$route.name === 'Scenarios'"
			id="nodered"
			:src="`//${$store.state.settings['aliceIp']}:1880`"
			title="nodered">
		</iframe>
	</portal-target>
</template>

<style scoped src="../css/scenariosIframe.css"></style>
<script src="../js/scenariosIframe.js"></script>
