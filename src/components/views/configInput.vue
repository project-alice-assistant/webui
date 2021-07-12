<!--suppress HtmlFormInputWithoutLabel -->
<template>
	<div class="centerLine">
		<VueToggles
			v-if="template['dataType'] === 'boolean'"
			:checked-text="translate('tooltips.yes')"
			:unchecked-text="translate('tooltips.no')"
			:value="configValue"
			checkedBg="var(--windowBG)"
			uncheckedBg="var(--windowBG)"
			:uncheckedColor="( missing() ? 'red' : 'white' )"
			:dotColor="( missing() ? 'red' : 'white' )"
			@click="$emit('input',!configValue); configValue = !configValue;"
			:readonly="template['readonly']"
		/>
		<input
			v-else-if="template['dataType'] === 'string' && !template['isSensitive']"
			v-model="configValue"
			v-init="configValue"
			:placeholder="template['defaultValue']"
			:class="{missing: missing(), invalid: !valid()}"
			:minlength="template['min']"
			:maxlength="template['max']"
			type="text"
			:readonly="template['readonly']"
		/>
	<input
		v-else-if="template['dataType'] === 'string' && template['isSensitive']"
		v-model="configValue"
		v-init="configValue"
		:placeholder="template['defaultValue']"
		:class="{missing: missing()}"
		type="password"
		:minlength="template['min']"
		:maxlength="template['max']"
	/>
	<input
		v-else-if="template['dataType'] === 'email'"
		v-model="configValue"
		v-init="configValue"
		:placeholder="template['defaultValue']"
		type="email"
		:readonly="template['readonly']"
	/>
	<input
		v-else-if="template['dataType'] === 'integer' && !template['isSensitive']"
		v-model="configValue"
		v-init="configValue"
		:placeholder="template['defaultValue']"
		type="number"
		:readonly="template['readonly']"
	/>
	<input
		v-else-if="template['dataType'] === 'integer' && template['isSensitive']"
		v-model="configValue"
		:placeholder="template['defaultValue']"
		type="password"
	/>
	<span v-else-if="template['dataType'] === 'faIcon'"
				class="centerLine">
		<input
			v-model="configValue"
			:placeholder="template['defaultValue']"
			type="text"
		/> <i :class="icon" aria-hidden="true" class="fa-2x" style="margin-left: .33em;"/>
	</span>
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
	<div v-else-if="template['dataType'] === 'range'" class="rangeInput">
		<input
			v-model="configValue"
			v-init="configValue"
			:max="template['max']"
			:min="template['min']"
			:placeholder="template['defaultValue']"
			:step="template['step']"
			type="range"
		/><span v-if="template['unit'] === '%'" class="inputRangeValue">{{ configValue*100 }}%</span>
		<span v-else-if="template['unit'] === 'em'" class="inputRangeValue">{{ configValue }}em</span>
		<span v-else class="inputRangeValue">{{ configValue }}</span>
	</div>
	<div v-else-if="template['dataType'] === 'range2rgba'" class="rangeInput">
		<input
			v-model="configValue"
			v-init="configValue"
			:max="template['max']"
			:min="template['min']"
			:placeholder="template['defaultValue']"
			:step="template['step']"
			type="range"
			@input="hex2rgba"
		/><span v-if="template['unit'] === '%'" class="inputRangeValue">{{ configValue*100 }}%</span>
		<span v-else class="inputRangeValue">{{ configValue }}{{ template['unit']}}</span>
	</div>
	<textarea v-else-if="template['dataType'] === 'longstring'"
						v-model="configValue"
						v-init="configValue"
						:placeholder="template['defaultValue']"
						:class="{missing: missing()}"
	/>
	<input v-else-if="template['dataType'] === 'color'"
				 type="color"
				 v-model="configValue"
				 v-init="configValue"
	/>
	<input v-else-if="template['dataType'] === 'color2rgba'"
				 type="color"
				 v-model="configValue"
				 v-init="configValue"
				 @input="hex2rgba"
	/>
	<configInputList v-else-if="template['dataType'] === 'userList'"
				 v-model="configValue"
				 v-init="configValue"
				 :template="template"/>
	<input v-else
				 v-model="configValue"
				 v-init="configValue"
				 :placeholder="template['defaultValue']"
				 type="text"
	/><span/>
	</div>
</template>

<script src="../js/configInput.js"/>
<style scoped>
	input[type=range]{
		width: 80%;
		min-width: 100px;
	}
	.inputRangeValue {
		min-width: 4em;
	}
	.rangeInput{
		display: flex;
		align-items: center;
		align-content: stretch;
	}
	input:read-only {
		color: var(--windowBG);
	}

	input:valid{
		border: 1px dotted green;
	}

	input:invalid,
	textarea:invalid,
	textarea.invalid,
	input.invalid {
		border: 1px dashed yellow;
	}

	input:invalid+span:after,
	.invalid+span:after {
		margin-left: .5em;
		display: inline-block;
		font-style: normal;
		font-variant: normal;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
		font-family: "Font Awesome 5 Free"; font-weight: 900; content: "\f071";
		color: yellow;
	}

	.missing+span:after{
		margin-left: .5em;
		display: inline-block;
		font-style: normal;
		font-variant: normal;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
		font-family: "Font Awesome 5 Free";
		font-weight: 900;
		color: red;
		content: "\f12a";
	}

	input.missing,
	textarea.missing {
		border: 1px dashed red;
	}

	.centerLine{
		display: flex;
		align-items: center;
	}


</style>
