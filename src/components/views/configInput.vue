<!--suppress HtmlFormInputWithoutLabel -->
<template>
	<input
		v-if="template['dataType'] === 'string' && !template['isSensitive']"
		v-model="configValue"
		v-init="configValue"
		:placeholder="template['defaultValue']"
		type="text"
	/>
	<input
		v-else-if="template['dataType'] === 'string' && template['isSensitive']"
		v-model="configValue"
		v-init="configValue"
		:placeholder="template['defaultValue']"
		type="password"
	/>
	<input
		v-else-if="template['dataType'] === 'email'"
		v-model="configValue"
		v-init="configValue"
		:placeholder="template['defaultValue']"
		type="email"
	/>
	<input
		v-else-if="template['dataType'] === 'integer' && !template['isSensitive']"
		v-model="configValue"
		v-init="configValue"
		:placeholder="template['defaultValue']"
		type="number"
	/>
	<input
		v-else-if="template['dataType'] === 'integer' && template['isSensitive']"
		v-model="configValue"
		:placeholder="template['defaultValue']"
		type="password"
	/>
	<select
		v-else-if="template['dataType'] === 'list'"
		v-model="configValue"
	>
		<option
			v-for="(value, text) in template['values']"
			v-if="template['values'].constructor === Object" v-bind:value="value"
		>
			{{ text }}
		</option>
		<option
			v-for="value in template['values']"
			v-if="template['values'].constructor === Array" v-bind:value="value"
		>
			{{ value }}
		</option>
	</select>
	<VueToggles
		v-else-if="template['dataType'] === 'boolean'"
		:checked-text="parent.$t('tooltips.yes')"
		:unchecked-text="parent.$t('tooltips.no')"
		:value="configValue"
		checkedBg="var(--windowBG)"
		uncheckedBg="var(--windowBG)"
		@click="configValue = !configValue"
	/>
	<div v-else-if="template['dataType'] === 'range'" class="rangeInput">
		<input
			v-model="configValue"
			v-init="configValue"
			:max="template['max']"
			:min="template['min']"
			:placeholder="template['defaultValue']"
			:step="template['step']"
			type="range"
		/><span class="inputRangeValue">{{ configName }}</span>
	</div>
	<textarea v-else-if="template['dataType'] === 'longstring'"
						v-model="configValue"
						v-init="configValue"
						:placeholder="template['defaultValue']"
	/>
	<input v-else
				 v-model="configValue"
				 v-init="configValue"
				 :placeholder="template['defaultValue']"
				 type="text"
	/>
</template>

<script src="../js/configInput.js"/>
