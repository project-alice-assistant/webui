<!--suppress HtmlFormInputWithoutLabel, HtmlUnknownAttribute -->
<template>
	<div class="custom-view-wrapper">
		<h3>{{parent.$t('dialogs.titles.skillSettings')}}</h3>
		<div class="configLayout">
			<div class="labels">
				<label
					:for="settingName"
					v-for="(settingTemplate, settingName) in options['skill']['settingsTemplate']"
					v-if="settingTemplate['display'] !== 'hidden'"
					v-tooltip="settingTemplate['description']"
					:class="settingTemplate['dataType'] === 'longstring' ? 'textAreaLabel' : ''"
				> <!--v-for-if-->
					{{ settingName }}:
				</label>
			</div>
			<div class="inputs">
				<div class="input"
						 v-for="(settingTemplate, settingName) in options['skill']['settingsTemplate']"
						 v-if="settingTemplate['display'] !== 'hidden'"> <!--v-for-if-->
					<input
						:id="settingName"
						type="text"
						v-if="settingTemplate['dataType'] === 'string' && !settingTemplate['isSensitive']"
						v-model="options['skill']['settings'][settingName]"
						v-init="options['skill']['settings'][settingName]"
						:placeholder="settingTemplate['defaultValue']"
					/>
					<input
						v-if="settingTemplate['dataType'] === 'email'"
						:id="settingName"
						v-model="options['skill']['settings'][settingName]"
						v-init="options['skill']['settings'][settingName]"
						:placeholder="settingTemplate['defaultValue']"
						type="email"
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
						:checked-text="parent.$t('tooltips.yes')"
						:unchecked-text="parent.$t('tooltips.no')"
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
					<select
						v-if="settingTemplate['dataType'] === 'list'"
						:id="settingName"
						v-model="options['skill']['settings'][settingName]"
					>
						<option
							v-if="settingTemplate['values'].constructor === Object"
							v-for="(value, text) in settingTemplate['values']" v-bind:value="value"
						>
							{{ text }}
						</option>
						<option
							v-if="settingTemplate['values'].constructor === Array"
							v-for="value in settingTemplate['values']" v-bind:value="value"
						>
							{{value}}
						</option>
					</select>
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
			<button @click="handleDismiss">{{parent.$t('buttons.cancel')}}</button>
			<button class="dg-pull-right" @click="handleConfirm">{{parent.$t('buttons.confirm')}}</button>
		</div>
	</div>
</template>

<script>
import VueDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'

export default {
	mixins: [VueDialogMixin],
	data: function() {
		return {
			parent: this.options['parent']
		}
	},
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
