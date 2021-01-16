<template>
	<div class="custom-view-wrapper">
		<h3>{{ parent.$t('dialogs.titles.deviceSettings') }}</h3>
		<h4>{{ parent.$t('dialogs.titles.generalSettings') }}</h4>
		<div class="configLayout">
			<div class="labels">
				<label for="displayName">{{ parent.$t('dialogs.labels.deviceDisplayName') }}: </label>
				<label v-if="data['allowHeartbeatOverride']" for="heartbeatRate">{{ parent.$t('dialogs.labels.heartbeatRate') }}: </label>
			</div>
			<div class="inputs">
				<div class="input">
					<input
						id="displayName"
						v-model="data['displayName']"
						v-init="data['displayName']"
						type="text"
					/>
				</div>
				<div class="input">
					<input
						v-if="data['allowHeartbeatOverride']"
						id="heartbeatRate"
						v-model="data['heartbeatRate']"
						v-init="data['heartbeatRate']"
						type="number"
					/>
				</div>
			</div>
		</div>
		<h4>{{ parent.$t('dialogs.titles.deviceLinksSettings') }}</h4>
		<div v-for="(link, linkId) in parent.myLinks" :key="linkId">
			<h4>{{ parent.$t('dialogs.titles.linkTo') }}: {{ link.middleLabel }}</h4>
			<div class="configLayout">
				<div class="labels">
					<label for="displayName">{{ parent.$t('dialogs.labels.deviceDisplayName') }}: </label>
				</div>
				<div class="inputs">
					<div class="input">
						<input
							id="displayName"
							v-model="data['displayName']"
							v-init="data['displayName']"
							type="text"
						/>
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
