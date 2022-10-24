<template>
	<div class="configLine">
		<label v-if="!template['subConfig']" :key="configName" v-tooltip="template.description">{{ this.formatName(configName) }}</label>
		<configInput :configName="configName" :holder="holder" :template="template" :translate="translate"/>
		<br/></div>
</template>

<script>
export default {
	name:    'configLine',
	props:   [
		'template',
		'configName',
		'holder',
		'translate',
		'confPrefix'
	],
	methods: {
		formatName: function (name) {
			let temp = name.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5').trim().replace(this.confPrefix, '')
			return temp.charAt(0).toUpperCase() + temp.slice(1)
		}
	}
}
</script>

<style scoped>
label {
	max-width: 50%;
	min-width: 20em;
}

.dg-container > * label {
	max-width: 50%;
	min-width: 46%;
}

.configLine {
	align-items: center;
	clear: both;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	padding: .5em;
	width: 100%;
}
</style>
