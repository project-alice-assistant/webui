<!--suppress HtmlFormInputWithoutLabel, HtmlUnknownAttribute -->
<template>
	<div class="custom-view-wrapper">
		<h3>Skill settings</h3>
		<div class="configLayout">
			<div class="labels">
				<label :for="settingName" v-for="(settingTemplate, settingName) in options['skill']['settingsTemplate']" v-tooltip="settingTemplate['description']">
					{{ settingName }}:
				</label>
			</div>
			<div class="inputs">
				<div class="input" v-for="(settingTemplate, settingName) in options['skill']['settingsTemplate']">
					<input
						:id="settingName"
						type="text"
						v-if="settingTemplate['dataType'] === 'string' && !settingTemplate['isSensitive']"
						v-model="options['skill']['settings'][settingName]"
						v-init="options['skill']['settings'][settingName]"
						:placeholder="settingTemplate['defaultValue']"
					/>
					<input
						:id="settingName"
						type="password"
						v-if="settingTemplate['dataType'] === 'string' && settingTemplate['isSensitive']"
						v-model="options['skill']['settings'][settingName]"
						v-init="options['skill']['settings'][settingName]"
						:placeholder="settingTemplate['defaultValue']"
					/>
					<input
						:id="settingName"
						type="number"
						v-if="settingTemplate['dataType'] === 'integer' && !settingTemplate['isSensitive']"
						v-model="options['skill']['settings'][settingName]"
						v-init="options['skill']['settings'][settingName]"
						:placeholder="settingTemplate['defaultValue']"
					/>
					<input
						:id="settingName"
						type="password"
						v-if="settingTemplate['dataType'] === 'integer' && settingTemplate['isSensitive']"
						v-model="options['skill']['settings'][settingName]"
						v-init="options['skill']['settings'][settingName]"
						:placeholder="settingTemplate['defaultValue']"
					/>
					<VueToggles
						:id="settingName"
						checked-text="Yes"
						unchecked-text="No"
						v-if="settingTemplate['dataType'] === 'boolean'"
						:value="options['skill']['settings'][settingName]"
						@click="options['skill']['settings'][settingName] = !options['skill']['settings'][settingName]"
						uncheckedBg="var(--windowBG)"
						checkedBg="var(--windowBG)"
					/>
					<input
						:id="settingName"
						type="range"
						v-if="settingTemplate['dataType'] === 'range'"
						:min="settingTemplate['dataType']['min']"
						:max="settingTemplate['dataType']['max']"
						:step="settingTemplate['dataType']['step']"
						v-model="options['skill']['settings'][settingName]"
						v-init="options['skill']['settings'][settingName]"
						:placeholder="settingTemplate['defaultValue']"
					/>
					<textarea
						:id="settingName"
						v-if="settingTemplate['dataType'] === 'longstring'"
						:placeholder="settingTemplate['defaultValue']"
						v-model="options['skill']['settings'][settingName]"
						v-init="options['skill']['settings'][settingName]"
					/>
				</div>
			</div>
		</div>
		<div>
			<button @click="handleDismiss">Cancel</button>
			<button class="dg-pull-right" @click="handleConfirm">Confirm</button>
		</div>
	</div>
</template>

<script>
import VueDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'

export default {
	mixins: [VueDialogMixin],
	methods: {
		handleConfirm() {
			this.proceed(this.options['skill']['settings'])
		},
		handleDismiss() {
			this.cancel()
		}
	}
};
</script>
