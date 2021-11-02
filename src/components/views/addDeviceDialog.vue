<template>
	<div class="custom-view-wrapper">
		<h3>{{ parent.$t('dialogs.titles.addDevice') }}</h3>
		<div v-if="Object.keys(parent.shownDeviceTypes).length > 0">
			<p>
				<label for="deviceList">{{ parent.$t('dialogs.bodies.chooseDevice') }}</label><br/>
			</p>
			<p v-if="Object.keys(parent.shownDeviceTypes).length > 0">
				<select id="deviceList" v-model="selected">
					<optgroup v-for="(deviceTypes, skillName) in parent.shownDeviceTypes" :key="skillName" :label="skillName.toUpperCase()">
						<option v-for="deviceType in deviceTypes" :key="deviceType.deviceTypeName" :value="deviceType">{{ deviceType.deviceTypeName }}</option>
					</optgroup>
				</select>
			</p>
		</div>
		<p v-else>
			{{ parent.$t('dialogs.bodies.noDevices') }}
		</p>
		<div>
			<button @click="handleDismiss">{{ parent.$t('buttons.cancel') }}</button>
			<button class="dg-pull-right" @click="handleConfirm">{{ parent.$t('buttons.confirm') }}</button>
		</div>
	</div>
</template>

<script>
import VueDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'

export default {
	mixins:  [VueDialogMixin],
	data:    function () {
		return {
			selected: null,
			parent:   this.options['parent'],
			error:    false
		}
	},
	methods: {
		handleConfirm() {
			if (!this.selected) this.cancel()
			this.proceed(this.selected)
		},
		handleDismiss() {
			this.cancel()
		}
	}
}
</script>
