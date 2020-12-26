<template>
	<div class="custom-view-wrapper">
		<h3>{{ parent.$t('dialogs.titles.addDevice') }}</h3>
		<p>
			<label for="deviceList">{{ parent.$t('dialogs.bodies.chooseDevice') }}</label><br/>
		</p>
		<p>
			<select id="deviceList" v-model="selected" name="device">
				<optgroup v-for="(devices, skillName) in parent.deviceTypes" :key="skillName" :label="skillName.toUpperCase()">
					<option v-for="device in devices" :key="device.deviceTypeName" :value="`${skillName.toLowerCase()}/${device.deviceTypeName.toLowerCase()}`">{{ device.deviceTypeName }}</option>
				</optgroup>
			</select>
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
	mixins: [VueDialogMixin],
	data: function () {
		return {
			selected: null,
			parent: this.options['parent'],
			error: false
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
