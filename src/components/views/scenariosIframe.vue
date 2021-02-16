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

<style src="../css/scenariosIframe.css" scoped></style>
<script src="../js/scenariosIframe.js"></script>
