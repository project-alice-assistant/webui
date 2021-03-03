<!--suppress JSUnresolvedVariable -->
<template>
	<div class="custom-view-wrapper">
		<h3>{{ parent.$t('dialogs.titles.deviceSettings') }}</h3>
		<h4>{{ parent.$t('dialogs.titles.generalSettings') }}</h4>
		<div class="configLayout">
			<div class="labels">
				<label for="displayName">{{ parent.$t('dialogs.labels.deviceDisplayName') }}: </label>
				<label v-if="data['allowHeartbeatOverride']" for="heartbeatRate">{{ parent.$t('dialogs.labels.heartbeatRate') }}: </label>
				<label v-for="(template, configName) in myConfigTemplates" :key="configName" v-tooltip="template.description">{{ configName }}</label>
			</div>
			<div class="inputs">
				<div class="input">
					<input
						id="displayName"
						v-model="displayName"
						v-init="displayName"
						type="text"
					/>
				</div>
				<div v-if="data['allowHeartbeatOverride']" class="input">
					<input id="heartbeatRate"
								 v-model="heartbeatRate"
								 v-init="heartbeatRate"
								 type="number"
					/>
				</div>
				<div v-for="(template, configName) in myConfigTemplates" :key="configName" class="input">
					<configInput :configName="configName" :holder="$data.parent.$store.state.devices[parent.data['id']].deviceConfigs" :parent="parent" :template="template"/>
				</div>
			</div>
		</div>
		<h4 v-if="parent.myLinks.length > 0">{{ parent.$t('dialogs.titles.deviceLinksSettings') }}</h4>
		<div v-for="(link, linkId) in parent.myLinks" :key="linkId">
			<h5>{{ parent.$t('dialogs.titles.linkTo') }}: {{ $data.parent.$store.state.locations[$data.parent.$store.state.deviceLinks[linkId].targetLocation].name }}</h5>
			<div class="configLayout">
				<div class="labels">
					<label v-for="(template, configName) in myLinkConfigTemplate" :key="configName" v-tooltip="template.description" :for="configName">{{ configName }}</label>
				</div>
				<div class="inputs">
					<div v-for="(template, configName) in myLinkConfigTemplate" :key="configName" class="input">
						<configInput :configName="configName" :holder="$data.parent.$store.state.deviceLinks[linkId].configs" :template="template"/>
					</div>
				</div>
			</div>
		</div>
		<button @click="handleDismiss">{{ parent.$t('buttons.cancel') }}</button>
		<button class="dg-pull-right" @click="handleConfirm">{{ parent.$t('buttons.confirm') }}</button>
	</div>
</template>

<style scoped>

</style>

<script>
import VueDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'

export default {
	mixins: [VueDialogMixin],
	data: function () {
		return {
			parent: this.options['parent'],
			data: this.options['data']
		}
	},
	computed: {
		myConfigTemplates: function () {
			return this.parent.myHome.getDeviceType(this).deviceConfigsTemplates
		},
		myLinkConfigTemplate: function () {
			return this.parent.myHome.getDeviceType(this).linkConfigsTemplates
		},
		configValue() {
			return (configName) => {
				return this.data.deviceConfigs[configName] || ''
			}
		},
		displayName: {
			get: function () {
				return this.data.deviceConfigs['displayName']
			},
			set: function (value) {
				return this.$data.parent.$store.state.devices[this.parent.data['id']].deviceConfigs['displayName'] = value
			}
		},
		heartbeatRate: {
			get: function () {
				return this.data.deviceConfigs['heartbeatRate']
			},
			set: function (value) {
				return this.$data.parent.$store.state.devices[this.parent.data['id']].deviceConfigs['heartbeatRate'] = value
			}
		}
	},
	methods: {
		handleConfirm() {
			this.proceed()
		},
		handleDismiss() {
			this.cancel()
		}
	}
}
</script>
