<template>
	<div class="custom-view-wrapper">
		<h3>{{ parent.$t('dialogs.titles.deviceSettings') }}</h3>
		<div>
			<button @click="handleDismiss">{{ parent.$t('buttons.cancel') }}</button>
			<button class="dg-pull-right" @click="handleConfirm">{{ parent.$t('buttons.confirm') }}</button>
		</div>
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
