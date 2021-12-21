<!--suppress HtmlFormInputWithoutLabel, CssNoGenericFontName -->
<template>
	<div class="centerLine">
		<VueToggles
			v-if="template['dataType'] === 'boolean'"
			:checked-text="translate('tooltips.yes')"
			:dotColor="( missing() ? 'red' : 'white' )"
			:readonly="template['readonly']"
			:unchecked-text="translate('tooltips.no')"
			:uncheckedColor="( missing() ? 'red' : 'white' )"
			:value="configValue"
			checkedBg="var(--windowBG)"
			uncheckedBg="var(--windowBG)"
			@change="checkSetters(configName)"
			@click="configValue = !configValue"
		/>
		<input
			v-else-if="template['dataType'] === 'string' && !template['isSensitive']"
			v-model="configValue"
			v-init="configValue"
			:class="{missing: missing(), invalid: !valid()}"
			:maxlength="template['max']"
			:minlength="template['min']"
			:placeholder="template['defaultValue']"
			:readonly="template['readonly']"
			type="text"
			@change="checkSetters(configName)"
		/>
		<input
			v-else-if="template['dataType'] === 'string' && template['isSensitive']"
			v-model="configValue"
			v-init="configValue"
			:class="{missing: missing()}"
			:maxlength="template['max']"
			:minlength="template['min']"
			:placeholder="template['defaultValue']"
			type="password"
			@change="checkSetters(configName)"
		/>
		<input
			v-else-if="template['dataType'] === 'email'"
			v-model="configValue"
			v-init="configValue"
			:placeholder="template['defaultValue']"
			:readonly="template['readonly']"
			type="email"
			@change="checkSetters(configName)"
		/>
		<input
			v-else-if="template['dataType'] === 'integer' && !template['isSensitive']"
			v-model="configValue"
			v-init="configValue"
			:placeholder="template['defaultValue']"
			:readonly="template['readonly']"
			type="number"
			@change="checkSetters(configName)"
		/>
		<input
			v-else-if="template['dataType'] === 'integer' && template['isSensitive']"
			v-model="configValue"
			:placeholder="template['defaultValue']"
			type="password"
			@change="checkSetters(configName)"
		/>
		<span v-else-if="template['dataType'] === 'faIcon'" class="centerLine">
		<input
			v-model="configValue"
			:placeholder="template['defaultValue']"
			type="text"
			@change="checkSetters(configName)"
		/> <i :class="icon" aria-hidden="true" class="fa-2x" style="margin-left: .33em;"/>
	</span>
		<select
			v-else-if="template['dataType'] === 'list'"
			v-model="configValue"
			@change="checkSetters(configName)"
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
				@change="checkSetters(configName)"
			/>
			<span v-if="template['unit'] === '%'" class="inputRangeValue">{{ configValue * 100 }}%</span>
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
				@change="checkSetters(configName)"
				@input="hex2rgba"
			/>
			<span v-if="template['unit'] === '%'" class="inputRangeValue">{{ configValue * 100 }}%</span>
			<span v-else class="inputRangeValue">{{ configValue }}{{ template['unit'] }}</span>
		</div>
		<textarea v-else-if="template['dataType'] === 'longstring'"
							v-model="configValue"
							v-init="configValue"
							:class="{missing: missing()}"
							:placeholder="template['defaultValue']"
							@change="checkSetters(configName)"
		/>
		<input v-else-if="template['dataType'] === 'color'"
					 v-model="configValue"
					 v-init="configValue"
					 type="color"
					 @change="checkSetters(configName)"
		/>
		<input v-else-if="template['dataType'] === 'color2rgba'"
					 v-model="configValue"
					 v-init="configValue"
					 type="color"
					 @change="checkSetters(configName)"
					 @input="hex2rgba"
		/>
		<configInputList v-else-if="template['dataType'] === 'userList'"
										 v-model="configValue"
										 v-init="configValue"
										 :template="template"
		/>
		<input v-else
					 v-model="configValue"
					 v-init="configValue"
					 :placeholder="template['defaultValue']"
					 type="text"
					 @change="checkSetters(configName)"
		/>
		<span/>
	</div>
</template>

<script src="../js/configInput.js"/>
<style scoped>
input[type=range] {
	min-width: 100px;
	width: 80%;
}

.inputRangeValue {
	min-width: 4em;
}

.rangeInput {
	align-content: stretch;
	align-items: center;
	display: flex;
}

input:valid {
	border: 1px dotted green;
}

input:invalid,
textarea:invalid,
textarea.invalid,
input.invalid {
	border: 1px dashed yellow;
}

input:invalid + span:after,
.invalid + span:after {
	color: yellow;
	content: "\f071";
	display: inline-block;
	font-family: "Font Awesome 5 Free";
	-webkit-font-smoothing: antialiased;
	font-style: normal;
	font-variant: normal;
	font-weight: 900;
	margin-left: .5em;
	text-rendering: auto;
}

.missing + span:after {
	color: red;
	content: "\f12a";
	display: inline-block;
	font-family: "Font Awesome 5 Free";
	-webkit-font-smoothing: antialiased;
	font-style: normal;
	font-variant: normal;
	font-weight: 900;
	margin-left: .5em;
	text-rendering: auto;
}

input.missing,
textarea.missing {
	border: 1px dashed red;
}

.centerLine {
	align-items: center;
	display: flex;
}
</style>
