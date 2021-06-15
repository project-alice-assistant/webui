<template>
	<div class="configLine">
		<label :key="configName" v-tooltip="template.description">{{ this.formatName(configName) }}</label>
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
		'translate',
		'confPrefix'
	],
	methods: {
		formatName: function (name) {
			let temp = name.replace(/((?<=[a-z])[A-Z]|[A-Z](?=[a-z]))/g, " $1").trim().replace(this.confPrefix, '')
			return temp.charAt(0).toUpperCase() + temp.slice(1);
		}
	}
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
