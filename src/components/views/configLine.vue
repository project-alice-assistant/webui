<template>
	<div class="configLine">
		<label :key="configName" v-tooltip="template.description">{{ configName }}</label>
		<configInput :configName="configName" :holder="holder" :translate="translate" :template="template"/>
	<br/></div>
</template>

<script>
export default {
	name: "configLine",
	props: [
		'template',
		'configName',
		'holder',
		'translate'
	]
}
</script>

<style scoped>
	label {
		max-width: 50%;
		min-width: 20em;
	}
	.dg-container >* label {
		max-width: 50%;
		min-width: 46%;
	}
	.configLine {
		clear:both;
		display:flex;
		flex-direction: row;
		width:100%;
		padding:.5em;
		align-items: center;
		flex-wrap: wrap;
	}
</style>
